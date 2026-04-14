/* ============================================================
   NutriControl — Supabase Client
   ============================================================ */
const SUPABASE_URL  = 'https://gjnwxlznjjzvuorpdqqm.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqbnd4bHpuamp6dnVvcnBkcXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDAzODUsImV4cCI6MjA5MTYxNjM4NX0.TOPhHR2pM64jj5zm5t2Mh3zZohbWCp7AKfmmUaTcJPY';

// El CDN expone window.supabase como módulo (con createClient).
// Creamos la instancia del cliente con un nombre global distinto
// para evitar conflictos con el módulo SDK.
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
