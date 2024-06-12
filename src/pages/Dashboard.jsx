// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Flex,
  Stack,
  Checkbox,
  Switch,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../utils/axiosInstance';
import Header from '../components/common/Header';
import { IoIosAddCircle } from "react-icons/io";
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [totalSpendsOperator, setTotalSpendsOperator] = useState('>');
  const [totalSpendsValue, setTotalSpendsValue] = useState(10000);
  const [totalSpendsUseType, setTotalSpendsUseType] = useState('AND');
  const [totalSpendsEnabled, setTotalSpendsEnabled] = useState(true);

  const [maxVisitsOperator, setMaxVisitsOperator] = useState('>');
  const [maxVisitsValue, setMaxVisitsValue] = useState(3);
  const [maxVisitsUseType, setMaxVisitsUseType] = useState('AND');
  const [maxVisitsEnabled, setMaxVisitsEnabled] = useState(true);

  const [lastVisitOperator, setLastVisitOperator] = useState('<');
  const [lastVisit, setLastVisit] = useState(new Date());
  const [lastVisitUseType, setLastVisitUseType] = useState('AND');
  const [lastVisitEnabled, setLastVisitEnabled] = useState(true);

  const [audience, setAudience] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  const [showFilterButton, setShowFilterButton] = useState(true);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // if any of the filters are modified, show the apply filters button
  useEffect(() => {
    setShowFilterButton(true);
  }, [totalSpendsEnabled, totalSpendsOperator, totalSpendsValue, totalSpendsUseType, maxVisitsEnabled, maxVisitsOperator, maxVisitsValue, maxVisitsUseType, lastVisitEnabled, lastVisitOperator, lastVisit, lastVisitUseType]);

  const handleApplyFilters = () => {
    const rules = [];

    if (totalSpendsEnabled) {
      rules.push({
        field: 'totalSpends',
        operator: totalSpendsOperator,
        value: totalSpendsValue,
        useType: totalSpendsUseType,
      });
    }

    if (maxVisitsEnabled) {
      rules.push({
        field: 'visits',
        operator: maxVisitsOperator,
        value: maxVisitsValue,
        useType: maxVisitsUseType,
      });
    }

    if (lastVisitEnabled) {
      rules.push({
        field: 'lastVisit',
        operator: lastVisitOperator,
        value: `${lastVisit.getFullYear()}-${(lastVisit.getMonth() + 1).toString().padStart(2, '0')}-${lastVisit.getDate().toString().padStart(2, '0')}T${lastVisit.getHours().toString().padStart(2, '0')}:${lastVisit.getMinutes().toString().padStart(2, '0')}:${lastVisit.getSeconds().toString().padStart(2, '0')}`, useType: lastVisitUseType,
      });
    }

    setFilterRules(rules);
    setLoading(true);
    axiosInstance
      .post('/audience', { rules })
      .then((response) => {
        setAudience(response.data);
        setShowFilterButton(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const toast = useToast();
  const handleCampaign = () => {
    //  Validate campaign name and message and audience size > 0  
    if (campaignName === '' || message === '') {
      toast({
        title: 'Campaign Name and Message are required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (audience.count === 0) {
      toast({
        title: 'Audience size is 0',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    axiosInstance
      .post('/campaign', {
        name: campaignName,
        message,
        campaignGroupId: audience.campaignGroupId,
      })
      .then((response) => {
        toast({
          title: 'Campaign generated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        navigate('/campaigns');
        
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: 'Failed to generate campaign',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      });    

  }

  return (
    <Box
      p={5}
      w="full" 
      overflowX="hidden" 
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, teal.200, blue.500)"
      position="relative"
      height="100vh"
      overflowY="hidden" 
    >
      <Header />
      <Box
        w="full"
        p={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          spacing={5}
          w="full"
          maxW="700px" 
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          p={5}
          boxShadow="lg"
          display="flex"
          mt={20}
          maxH="80vh"
          overflowY="auto"
          flexDirection="column"
        >
          <Heading
            fontSize={"2xl"}
            fontWeight={"800"}
          >Generate Campaign

          </Heading>
          <Box>
            <Text mb={2}
              fontWeight={"bold"}
              color={totalSpendsEnabled ? 'teal.500' : 'gray.500'}
            >Total Spends</Text>
            <Flex align="center" mb={2}>
              <Checkbox
                isChecked={totalSpendsEnabled}
                onChange={(e) => setTotalSpendsEnabled(e.target.checked)}
                mr={2}
              >
                Enable
              </Checkbox>
              <FormControl
                display="flex"
                alignItems="center"
                borderWidth="1px"
                borderRadius="md"
                p={2}
                justifyContent="center"
                bg="gray.100"
              >
                <FormLabel htmlFor="totalSpendsUseType" mb="0">
                  OR
                </FormLabel>
                <Switch
                  id="totalSpendsUseType"
                  isChecked={totalSpendsUseType === 'AND'}
                  onChange={(e) => {
                    setTotalSpendsUseType(e.target.checked ? 'AND' : 'OR')
                    setLastVisitUseType(e.target.checked ? 'AND' : 'OR')
                    setMaxVisitsUseType(e.target.checked ? 'AND' : 'OR')

                  }}
                />
                <FormLabel htmlFor="totalSpendsUseType" mb="0" ml="2">
                  AND
                </FormLabel>
              </FormControl>
            </Flex>

            <Flex align="center"

            >
              <Select
                value={totalSpendsOperator}
                onChange={(e) => setTotalSpendsOperator(e.target.value)}
                mr={6}
              >
                <option value=">">More than</option>
                <option value="<">Less than</option>
                <option value="=">Equal to</option>
              </Select>
              <Slider
                defaultValue={10000}
                min={0}
                max={100000}
                step={1000}
                onChange={(val) => setTotalSpendsValue(val)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color="tomato" />
                </SliderThumb>
              </Slider>
              <Text ml={2}
                fontWeight="bold"
                fontSize="xs"
                noOfLines={1}
                minW="80px"
              >INR {totalSpendsValue}</Text>
            </Flex>
          </Box>

          <Box>
            <Text mb={2}
              fontWeight={"bold"}
              color={maxVisitsEnabled ? 'teal.500' : 'gray.500'}
            >Number of Visits</Text>
            <Flex align="center" mb={2}>
              <Checkbox
                isChecked={maxVisitsEnabled}
                onChange={(e) => setMaxVisitsEnabled(e.target.checked)}
                mr={2}
              >
                Enable
              </Checkbox>
              <FormControl
                display="flex"
                alignItems="center"
                borderWidth="1px"
                borderRadius="md"
                p={2}
                justifyContent="center"
                bg="gray.100"
              >
                <FormLabel htmlFor="maxVisitsUseType" mb="0">
                  OR
                </FormLabel>
                <Switch
                  id="maxVisitsUseType"
                  isChecked={maxVisitsUseType === 'AND'}
                  onChange={(e) => {
                    setTotalSpendsUseType(e.target.checked ? 'AND' : 'OR')
                    setLastVisitUseType(e.target.checked ? 'AND' : 'OR')
                    setMaxVisitsUseType(e.target.checked ? 'AND' : 'OR')
                  }}
                />
                <FormLabel htmlFor="maxVisitsUseType" mb="0" ml="2">
                  AND
                </FormLabel>
              </FormControl>
            </Flex>
            <Flex align="center">
              <Select
                value={maxVisitsOperator}
                onChange={(e) => setMaxVisitsOperator(e.target.value)}
                mr={2}
              >
                <option value=">">More than</option>
                <option value="<">Less than</option>
                <option value="=">Equal to</option>
              </Select>
              <Slider
                defaultValue={3}
                min={0}
                max={20}
                step={1}
                onChange={(val) => setMaxVisitsValue(val)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color="tomato" />
                </SliderThumb>
              </Slider>
              <Text ml={2}
                fontWeight="bold"
                fontSize="xs"
                noOfLines={1}
                minW="60px"
              >{maxVisitsValue} visits</Text>
            </Flex>
          </Box>

          <Box>
            <Text mb={2}
              fontWeight={"bold"}
              color={lastVisitEnabled ? 'teal.500' : 'gray.500'}
            >Last Visit</Text>
            <Flex align="center" mb={2}>
              <Checkbox
                isChecked={lastVisitEnabled}
                onChange={(e) => setLastVisitEnabled(e.target.checked)}
                mr={2}
              >
                Enable
              </Checkbox>
              <FormControl
                display="flex"
                alignItems="center"
                borderWidth="1px"
                borderRadius="md"
                p={2}
                justifyContent="center"
                bg="gray.100"
              >
                <FormLabel htmlFor="lastVisitUseType" mb="0">
                  OR
                </FormLabel>
                <Switch
                  id="lastVisitUseType"
                  isChecked={lastVisitUseType === 'AND'}
                  onChange={(e) => {
                    setTotalSpendsUseType(e.target.checked ? 'AND' : 'OR')
                    setLastVisitUseType(e.target.checked ? 'AND' : 'OR')
                    setMaxVisitsUseType(e.target.checked ? 'AND' : 'OR')

                  }}
                />
                <FormLabel htmlFor="lastVisitUseType" mb="0" ml="2">
                  AND
                </FormLabel>
              </FormControl>
            </Flex>
            <Flex align="center">
              <Select
                value={lastVisitOperator}
                onChange={(e) => setLastVisitOperator(e.target.value)}
                maxW="120px"
                mr={2}
                flex={1}
              >
                <option value="<">Before</option>
                <option value=">">After</option>
              </Select>
              <Box
                flex={2}
                borderWidth="1px"
                borderRadius="md"
                p={2}

              >
                <DatePicker
                  selected={lastVisit}
                  onChange={(date) => setLastVisit(date)}
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                />
              </Box>
            </Flex>
          </Box>

          {showFilterButton && <Button onClick={handleApplyFilters} colorScheme="teal"
            w="full"
            p={2}
            rightIcon={<FaUsers />}
            isLoading={loading}
          >
            Check Audience Size
          </Button>
          }

          {!showFilterButton && <Box
            borderWidth="2px"
            borderColor="yellow.500"
            borderRadius="xl"
            p={4}
            bg="yellow.100"
            shadow="md"
          >
            <Text fontSize="xl"
              fontWeight="bold"
              color="yellow.700"
            >
              Audience Size: {audience.count}
            </Text>
          </Box>
          }
          {!showFilterButton && <Box>
            {/* Campaign name, message and Generate Campaign button */}
            <Input placeholder="Campaign Name" mb={2} 
              onChange={(e) => setCampaignName(e.target.value)}
              value={campaignName}
            />
            <Input placeholder="Message" mb={2} 
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <Button colorScheme="blue"
              w="full"
              isLoading={loading}
              rightIcon={<IoIosAddCircle
                size={20}
              
              />}
              onClick={handleCampaign}
            >
              Generate Campaign
            </Button>
          </Box>
          }

        </Stack>
      </Box>
    </Box>
  );
};

export default Dashboard;
