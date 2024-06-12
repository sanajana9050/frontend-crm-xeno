import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    useBreakpointValue,
    useToast,
    useClipboard,
    Spinner,
} from '@chakra-ui/react';
import Header from '../components/common/Header';
import axiosInstance from '../utils/axiosInstance';
import React from 'react';


// const campaignsData = [
//     {
//         "_id": "66685b366e536a860a089be9",
//         "name": "Consumer Group For March Sale",
//         "campaignGroupId": "66685b1d6e536a860a089be6",
//         "message": "Get 50% off",
//         "createdAt": "2024-06-11T14:12:06.699Z",
//         "__v": 0,
//         "audienceSize": 617,
//         "sentSize": 553,
//         "failedSize": 64
//     }
// ];

// // multiply campaignData to have more data to display
// // 250 times
// for (let i = 0; i < 250; i++) {
//     campaignsData.push(campaignsData[0]);
// }


function CampaignsPage() {

    const textSize = useBreakpointValue({ base: 'xl', md: '2xl', lg: '2xl' });
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);
    const [campaignsData, setCampaignsData] = React.useState([]);

    const fetchCampaigns = async () => {
        setLoading(true);
        axiosInstance.get('/campaign')
            .then((response) => {
                setCampaignsData(response.data)
                console.log(response.data);
            }
            )
            .catch((error) => {
                console.error(error);
            }
            )
            .finally(() => {
                setLoading(false);
            });
    };

    React.useEffect(() => {
        fetchCampaigns();
    }, []);
    

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value).then(() => {
            toast({
                title: 'Copied',
                description: `${value} copied to clipboard.`,
                status: 'info',
                duration: 2000,
                isClosable: true,
            });
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };


    return (
        <Box p={5}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
            bgGradient="linear(to-r, teal.200, blue.500)"
        >
            <Header />
            <Box
                p={5}
                pt={0}
                bg="white"
                borderRadius="md"
                height="80vh"
                overflow="auto"
                position="relative"
                mt={16}
                width="96vw"
            >
                <Box position="sticky" top={0} left={0} right={0} p={5} bg="white" >
                    <Text fontSize={textSize} fontWeight="bold"
                    >Published Campaigns</Text>
                </Box>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                >
                    {loading && <Spinner size="lg"
                        color="gray.500"
                        thickness="4px"
                    />}
                </Box>
                
                <TableContainer overflowX="auto">
                    <Table variant="simple" size={useBreakpointValue({ base: 'md', md: 'md', lg: 'md' })}>
                        <Thead>
                            <Tr>
                                <Th>Campaign ID</Th> {/* Added Campaign ID column */}
                                <Th>Name</Th>
                                <Th>Message</Th>
                                <Th isNumeric>Audience Size</Th>
                                <Th isNumeric>Sent Size</Th>
                                <Th isNumeric>Failed Size</Th>
                                <Th>Created At</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {campaignsData.map((campaign) => (
                                <Tr key={campaign._id}>
                                    <Td maxW="50px" isTruncated onClick={() => handleCopy(campaign._id)} sx={{ cursor: 'pointer', _hover: { bg: 'gray.100' } }}>
                                        {campaign._id.slice(-8)}
                                    </Td>
                                    <Td onClick={() => handleCopy(campaign.name)} sx={{ cursor: 'pointer', _hover: { bg: 'gray.100' } }}>{campaign.name}</Td>
                                    <Td onClick={() => handleCopy(campaign.message)} sx={{ cursor: 'pointer', _hover: { bg: 'gray.100' } }}>{campaign.message}</Td>
                                    <Td isNumeric onClick={() => handleCopy(campaign.audienceSize.toString())} sx={{ cursor: 'pointer', _hover: { bg: 'gray.100' } }}>
                                        {campaign.audienceSize}
                                    </Td>
                                    <Td isNumeric onClick={() => handleCopy(campaign.sentSize.toString())} sx={{ cursor: 'pointer', _hover: { bg: 'gray.100' } }}>
                                        {campaign.sentSize}
                                    </Td>
                                    <Td isNumeric onClick={() => handleCopy(campaign.failedSize.toString())} sx={{ cursor: 'pointer', _hover: { bg: 'gray.100' } }}>
                                        {campaign.failedSize}
                                    </Td>
                                    <Td onClick={() => handleCopy(new Date(campaign.createdAt).toString().slice(0, 24))} sx={{ cursor: 'pointer', _hover: { bg: 'gray.100' } }}>
                                        {new Date(campaign.createdAt).toString().slice(0, 24)}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default CampaignsPage;