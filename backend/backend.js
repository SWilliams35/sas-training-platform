import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth Endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: passwordHash }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (error || !user) throw new Error('User not found');

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) throw new Error('Invalid password');

    const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, is_admin: user.is_admin } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Modules Endpoints
app.get('/api/modules', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select()
      .order('order_index');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Progress Endpoints
app.get('/api/progress/user/:userId', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select()
      .eq('user_id', req.params.userId);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/progress/update', verifyToken, async (req, res) => {
  try {
    const { module_id, status, progress_percentage } = req.body;
    const user_id = req.user.id;

    const { data: existing } = await supabase
      .from('user_progress')
      .select()
      .eq('user_id', user_id)
      .eq('module_id', module_id)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('user_progress')
        .update({ status, progress_percentage, completed_at: status === 'Completed' ? new Date() : null })
        .eq('user_id', user_id)
        .eq('module_id', module_id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('user_progress')
        .insert([{
          user_id,
          module_id,
          status,
          progress_percentage,
          completed_at: status === 'Completed' ? new Date() : null
        }])
        .select()
        .single();
    }

    if (result.error) throw result.error;
    res.json(result.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/stats/:userId', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select()
      .eq('user_id', req.params.userId);

    if (error) throw error;

    const stats = {
      completed: data.filter(p => p.status === 'Completed').length,
      in_progress: data.filter(p => p.status === 'In Progress').length,
      not_started: data.filter(p => p.status === 'Not Started').length
    };

    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/progress', verifyToken, async (req, res) => {
  try {
    if (!req.user.is_admin) throw new Error('Admin only');

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email');

    if (usersError) throw usersError;

    const userStats = await Promise.all(users.map(async (user) => {
      const { data: progress } = await supabase
        .from('user_progress')
        .select()
        .eq('user_id', user.id);

      return {
        user_id: user.id,
        email: user.email,
        completed: progress.filter(p => p.status === 'Completed').length,
        in_progress: progress.filter(p => p.status === 'In Progress').length,
        not_started: progress.filter(p => p.status === 'Not Started').length
      };
    }));

    res.json(userStats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User Endpoints
app.get('/api/me', verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select()
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ id: user.id, email: user.email, is_admin: user.is_admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users', verifyToken, async (req, res) => {
  try {
    if (!req.user.is_admin) throw new Error('Admin only');

    const { data, error } = await supabase
      .from('users')
      .select('id, email, is_admin');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
