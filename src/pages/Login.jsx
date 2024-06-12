// src/pages/Login.jsx
import React from 'react';
import { Flex, Box, Heading, Text, Center, Fade, SlideFade, useBreakpointValue, useToast } from '@chakra-ui/react';
import GoogleButton from 'react-google-button'; // Assuming you have this component
import { auth, provider, signInWithPopup } from '../utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);
  const handleLogin = async () => {
    try {
        setLoading(true);
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
        //save user info in local storage
        localStorage.setItem('user', JSON.stringify(result.user));

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/authenticate', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });
        const data = await response.json();
        // if status code 200 and message is 'Authenticated' then redirect to dashboard
        if (response.status === 200 && data.message === 'Authenticated') {
            setLoading(false);
            navigate('/dashboard');
            toast({
                title: 'Login Successful',
                description: 'Signed in as ' + result.user.displayName,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
      } catch (error) {
        console.error('Error during sign-in:', error);
      }
    };


  // Responsive font sizes
  const headingFontSize = useBreakpointValue({ base: '4xl', md: '6xl' });
  const textFontSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  // Responsive padding for the Box
  const boxPadding = useBreakpointValue({ base: '6', md: '12' });

  // Responsive margin and padding for the authentication card
  const authCardWidth = useBreakpointValue({ base: '90%', md: 'sm' });
  const authCardPadding = useBreakpointValue({ base: '6', md: '8' });

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" 
        width="100vw" bgGradient="linear(to-r, teal.200, blue.500)"
        padding={useBreakpointValue({ base: 4, md: 16 })}
        flexDirection={{ base: 'column', md: 'row' }}
    >
      <style>
        {`
          @keyframes zoomOut {
            from {
              transform: scale(1.5);
            }
            to {
              transform: scale(1);
            }
          }
        `}
      </style>
      <Box
        flex={{ base: 1, md: 'auto' }}
        height="100%"
        padding={boxPadding}
        color="white"
        bg="blackAlpha.800"
        backgroundBlendMode="darken"
        borderRadius="xl"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1622782914767-404fb9ab3f57?auto=format&fit=crop&w=2564&q=80')`,
          backgroundSize: 'cover',
          animation: 'zoomOut 0.8s cubic-bezier(0.870, 0.040, 0.000, 0.985) forwards',
        }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        textAlign="left"
      >
        <Fade in={true} delay={0.7} duration={0.6}>
          <Heading mb="4" fontSize={headingFontSize} fontWeight="extrabold" textAlign='left' width="100%">
            Welcome to TinyCRM
          </Heading>
        </Fade>
        <SlideFade in={true} offsetY="20px" delay={1.2} duration={1.5}>
          <Text fontSize={textFontSize} mb="4">
            Manage your audience and leads efficiently. <br />Stay connected with your customers.
          </Text>
        </SlideFade>
      </Box>

      {/* Authentication Card */}
      <Center flex={{ base: 0.6, md: '1' }}
        width={{ base: '100%', md: 'sm' }}
        ml={{ base: 0, md: 10 }}
      >
        <Box width={authCardWidth} padding={authCardPadding} boxShadow="lg" borderRadius="lg" bg="white"
            borderWidth="1px" borderColor="gray.200" 
            justifyContent="center" alignItems="center"
            display="flex" flexDirection="column"
        >
          <Heading mb="1" textAlign="center">Sign In</Heading>
          <Text mb="6" textAlign="center"
            fontSize="sm" color="gray.600"
          >Sign in to access your CRM account</Text>

          <GoogleButton onClick={handleLogin} 
            disabled={loading}
          />
        </Box>
      </Center>
    </Flex>
  );
};

export default Login;