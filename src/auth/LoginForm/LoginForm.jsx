import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 Box,
 Paper,
 TextField,
 Button,
 Typography,
 Container,
 InputAdornment,
 IconButton,
} from '@mui/material';
import {
 Email as EmailIcon,
 Lock as LockIcon,
 Visibility as VisibilityIcon,
 VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import logo from '../../assets/royalclub-logo.png';

const LoginForm = ({ onLogin }) => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState({
   email: '',
   password: '',
 });
 const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = (e) => {
   e.preventDefault();
   onLogin();
   navigate('/');
 };

 return (
   <Box
     sx={{
       minHeight: '100vh',
       background: 'linear-gradient(135deg, #1E1E1E 0%, #2C2C2C 100%)',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       position: 'relative',
       overflow: 'hidden',
     }}
   >
     {/* Elementos decorativos de fondo */}
     <Box
       sx={{
         position: 'absolute',
         width: '300px',
         height: '300px',
         borderRadius: '50%',
         background: 'radial-gradient(circle, rgba(0, 255, 209, 0.1) 0%, rgba(0, 255, 209, 0) 70%)',
         top: '-100px',
         right: '-100px',
       }}
     />
     <Box
       sx={{
         position: 'absolute',
         width: '200px',
         height: '200px',
         borderRadius: '50%',
         background: 'radial-gradient(circle, rgba(0, 255, 209, 0.05) 0%, rgba(0, 255, 209, 0) 70%)',
         bottom: '-50px',
         left: '-50px',
       }}
     />

     <Container maxWidth="sm">
       <Box sx={{ textAlign: 'center', mb: 6 }}>
         <Box
           component="img"
           src={logo}
           alt="Royal Trade Logo"
           sx={{
             width: '100px',
             height: '100px',
             mb: 3,
             filter: 'drop-shadow(0 0 10px rgba(0, 255, 209, 0.3))',
           }}
         />
         <Typography
           variant="h4"
           sx={{
             color: '#00FFD1',
             fontWeight: 600,
             letterSpacing: '0.5px',
             textShadow: '0 0 20px rgba(0, 255, 209, 0.3)',
           }}
         >
           Operaciones Royal Markets
         </Typography>
       </Box>

       <Paper
         elevation={24}
         sx={{
           p: 4,
           backgroundColor: 'rgba(44, 44, 44, 0.9)',
           backdropFilter: 'blur(10px)',
           borderRadius: 3,
           border: '1px solid rgba(0, 255, 209, 0.1)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
         }}
       >
         <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
           <TextField
             margin="normal"
             required
             fullWidth
             id="email"
             label="Email"
             name="email"
             autoComplete="email"
             autoFocus
             value={formData.email}
             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <EmailIcon sx={{ color: '#00FFD1' }} />
                 </InputAdornment>
               ),
             }}
             sx={{
               '& label': { color: '#FFFFFF' },
               '& label.Mui-focused': { color: '#00FFD1' },
               '& .MuiOutlinedInput-root': {
                 color: '#FFFFFF',
                 '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                 '&:hover fieldset': { borderColor: '#FFFFFF' },
                 '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
               },
             }}
           />

           <TextField
             margin="normal"
             required
             fullWidth
             name="password"
             label="Password"
             type={showPassword ? 'text' : 'password'}
             id="password"
             autoComplete="current-password"
             value={formData.password}
             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <LockIcon sx={{ color: '#00FFD1' }} />
                 </InputAdornment>
               ),
               endAdornment: (
                 <InputAdornment position="end">
                   <IconButton
                     onClick={() => setShowPassword(!showPassword)}
                     edge="end"
                     sx={{ color: '#00FFD1' }}
                   >
                     {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                   </IconButton>
                 </InputAdornment>
               ),
             }}
             sx={{
               '& label': { color: '#FFFFFF' },
               '& label.Mui-focused': { color: '#00FFD1' },
               '& .MuiOutlinedInput-root': {
                 color: '#FFFFFF',
                 '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                 '&:hover fieldset': { borderColor: '#FFFFFF' },
                 '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
               },
             }}
           />

           <Button
             type="submit"
             fullWidth
             variant="contained"
             sx={{
               mt: 4,
               py: 1.5,
               backgroundColor: '#00FFD1',
               color: '#1E1E1E',
               fontSize: '1rem',
               fontWeight: 600,
               borderRadius: 2,
               textTransform: 'none',
               '&:hover': {
                 backgroundColor: '#00CCB7',
                 boxShadow: '0 0 20px rgba(0, 255, 209, 0.3)',
               },
               transition: 'all 0.3s ease',
             }}
           >
             Iniciar Sesión
           </Button>
         </Box>
       </Paper>
     </Container>
   </Box>
 );
};

export default LoginForm;