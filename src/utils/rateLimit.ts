import { supabase } from '../lib/supabase';
import { generateFingerprint } from './fingerprint';

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  remainingAttempts?: number;
  blockedUntil?: Date;
  waitTime?: number;
}

const MAX_ATTEMPTS_PER_HOUR = 5;
const MAX_ATTEMPTS_PER_DAY = 15;
const PROGRESSIVE_DELAYS = [0, 2000, 5000, 10000, 30000];

export async function checkRateLimit(): Promise<RateLimitResult> {
  const fingerprint = generateFingerprint();

  try {
    await cleanupExpiredData();

    const isBlocked = await checkIfBlocked(fingerprint);
    if (isBlocked.blocked) {
      return {
        allowed: false,
        reason: `Too many failed attempts. Try again after ${isBlocked.blockedUntil?.toLocaleString()}`,
        blockedUntil: isBlocked.blockedUntil,
      };
    }

    const recentAttempts = await getRecentAttempts(fingerprint);

    const attemptsLastHour = recentAttempts.filter(
      (attempt) => new Date(attempt.attempted_at) > new Date(Date.now() - 60 * 60 * 1000)
    );

    const attemptsLastDay = recentAttempts.filter(
      (attempt) => new Date(attempt.attempted_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    if (attemptsLastDay.length >= MAX_ATTEMPTS_PER_DAY) {
      await blockFingerprint(fingerprint, 24 * 60, 'Exceeded daily limit');
      return {
        allowed: false,
        reason: 'Too many failed attempts today. Try again tomorrow.',
      };
    }

    if (attemptsLastHour.length >= MAX_ATTEMPTS_PER_HOUR) {
      await blockFingerprint(fingerprint, 60, 'Exceeded hourly limit');
      return {
        allowed: false,
        reason: 'Too many failed attempts. Try again in 1 hour.',
      };
    }

    const waitTime = PROGRESSIVE_DELAYS[Math.min(attemptsLastHour.length, PROGRESSIVE_DELAYS.length - 1)];

    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS_PER_HOUR - attemptsLastHour.length,
      waitTime,
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS_PER_HOUR,
    };
  }
}

export async function recordLoginAttempt(success: boolean): Promise<void> {
  const fingerprint = generateFingerprint();

  try {
    const { error } = await supabase
      .from('login_attempts')
      .insert([{
        fingerprint,
        ip_address: 'client-side',
        was_successful: success,
      }]);

    if (error) {
      console.error('Error recording login attempt:', error);
    }

    if (success) {
      await clearFailedAttempts(fingerprint);
    }
  } catch (error) {
    console.error('Error recording login attempt:', error);
  }
}

async function checkIfBlocked(fingerprint: string): Promise<{ blocked: boolean; blockedUntil?: Date }> {
  try {
    const { data, error } = await supabase
      .from('blocked_fingerprints')
      .select('blocked_until')
      .eq('fingerprint', fingerprint)
      .maybeSingle();

    if (error) {
      console.error('Error checking block status:', error);
      return { blocked: false };
    }

    if (!data) {
      return { blocked: false };
    }

    const blockedUntil = new Date(data.blocked_until);
    if (blockedUntil > new Date()) {
      return { blocked: true, blockedUntil };
    }

    return { blocked: false };
  } catch (error) {
    console.error('Error checking block status:', error);
    return { blocked: false };
  }
}

async function getRecentAttempts(fingerprint: string) {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('login_attempts')
      .select('attempted_at, was_successful')
      .eq('fingerprint', fingerprint)
      .eq('was_successful', false)
      .gte('attempted_at', oneDayAgo)
      .order('attempted_at', { ascending: false });

    if (error) {
      console.error('Error fetching recent attempts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recent attempts:', error);
    return [];
  }
}

async function blockFingerprint(fingerprint: string, minutes: number, reason: string): Promise<void> {
  try {
    const blockedUntil = new Date(Date.now() + minutes * 60 * 1000);

    const { error } = await supabase
      .from('blocked_fingerprints')
      .upsert([{
        fingerprint,
        blocked_until: blockedUntil.toISOString(),
        reason,
      }], {
        onConflict: 'fingerprint'
      });

    if (error) {
      console.error('Error blocking fingerprint:', error);
    }
  } catch (error) {
    console.error('Error blocking fingerprint:', error);
  }
}

async function clearFailedAttempts(fingerprint: string): Promise<void> {
  try {
    await supabase
      .from('blocked_fingerprints')
      .delete()
      .eq('fingerprint', fingerprint);
  } catch (error) {
    console.error('Error clearing failed attempts:', error);
  }
}

async function cleanupExpiredData(): Promise<void> {
  try {
    await supabase.rpc('cleanup_expired_blocks');
    await supabase.rpc('cleanup_old_login_attempts');
  } catch (error) {
    console.error('Cleanup error (non-critical):', error);
  }
}
