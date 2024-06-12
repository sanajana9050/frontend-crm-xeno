import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, Button, Link, useColorModeValue, Heading, Divider } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { signOut, auth } from '../../utils/firebaseConfig';

const Header = () => {
  // Initialize errorCount from localStorage if available, otherwise start at 0
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.600', 'white');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const fetchUser = async () => {
    // get user from local storage
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    } else {
      navigate('/');
    }
  } 

  useEffect(() => {
    fetchUser();
  }, []);

  const logoutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  }


  return (
    <Box bg={bg} w="100%" p={4} color={color} boxShadow="sm" position="fixed" top={0} zIndex={1000}>
      <Flex alignItems="center" justifyContent="space-between">
        {user ? (
          <>
            <Flex alignItems="center">
              <Heading size="md" mr={4}
                fontWeight={500}

              >Tiny
                <Text as="span" fontWeight={800} color="linear(to-r, teal.200, blue.500)" bgGradient="linear(to-r, teal.300, blue.500)" bgClip="text"
                >CRM</Text>
              </Heading>
              <Link href="/dashboard" p={2} _hover={{ bg: hoverBg, borderRadius: 'md' }}>Dashboard</Link>
              <Link href="/campaigns" p={2} _hover={{ bg: hoverBg, borderRadius: 'md' }}>Campaigns</Link>
            </Flex>
            <Menu>
              <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                <Avatar size={'sm'} src={user.photoURL} />
              </MenuButton>
              <MenuList
                p={2}


              >
                <Box textAlign="center">
                  <Avatar size={'md'} src={user.photoURL}
                    mx="auto"
                    my={2}

                  />
                </Box>
                <Heading
                  fontSize="md"
                  color="gray.800"
                  textAlign="center"
                  mt={2}
                >{user.displayName || user.email}</Heading>
                <Text color="gray.500" textAlign="center" mb={2} mt={1}
                  fontSize="sm"
                >{user.email}</Text>
                <Divider
                  mb={2}
                />
                <MenuItem onClick={logoutUser}
                  color="red.500"
                  _hover={{ bg: 'red.100', borderWidth: 0 }}
                  textAlign="center"
                  w="100%"
                  borderWidth={0}
                  _focus={{ borderWidth: 0 }}
                >Log out</MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <Text>Login</Text>
        )}
      </Flex>
    </Box>
  );
};

export default Header;