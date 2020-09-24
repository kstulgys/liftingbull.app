import React from 'react'
import { useRouter } from 'next/router'
import { AppDrawer } from '../components/AppDrawer'
import { useAuth } from '../utils/useAuth'
import { Stack, Text, Button, Box, Select, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/core'
import Layout from '../components/Layout'
import { CurrentWorkout } from '../components/CurrentWorkout'
import { useStore } from '../utils/store'
import { useDocument } from '@nandorojo/swr-firestore'
import { useSettings } from '../utils/useSettings'

function AppPage() {
  const router = useRouter()
  const { user, loading } = useAuth((store) => store)
  const { signout } = useAuth((store) => store.actions)

  React.useEffect(() => {
    if (!user?.uid) router.push('/signin')
  }, [user])

  if (!user?.uid) return null

  return (
    <Layout>
      <Stack shouldWrapChildren maxW="sm" width="full" mx="auto" minH="100vh" p="4" height="full" fontSize="xl">
        <Select
          defaultValue="option3"
          size="lg"
          style={{
            textAlign: 'center',
            textAlignLast: 'center',
          }}
        >
          <option value="option1">BP</option>
          <option value="option2">SQ</option>
          <option value="option3">OP</option>
        </Select>
        <Stack isInline spacing="4">
          <Stack width="50%">
            <Box>
              <Text textAlign="center" color="white">
                Reps
              </Text>
            </Box>
            <Box width="full">
              <Select
                width="full"
                defaultValue="option3"
                size="lg"
                style={{
                  textAlign: 'center',
                  textAlignLast: 'center',
                }}
              >
                <option value="option1">6</option>
                <option value="option2">7</option>
                <option value="option3">8</option>
              </Select>
            </Box>
          </Stack>
          <Stack width="50%">
            <Box>
              <Text textAlign="center" color="white">
                Rpe
              </Text>
            </Box>
            <Box width="full">
              <Select
                width="full"
                defaultValue="option1"
                size="lg"
                style={{
                  textAlign: 'center',
                  textAlignLast: 'center',
                }}
              >
                <option value="option1">6</option>
                <option value="option2">7</option>
                <option value="option3">8</option>
              </Select>
            </Box>
          </Stack>
        </Stack>
        <WorksetPlates />
        <Section />
        {/* <Box>
          <Button onClick={signout}>Signout</Button>
        </Box> */}
      </Stack>
    </Layout>
  )
}

function WorksetPlates() {
  return (
    <Stack color="white">
      <Box>
        <Text textAlign="center">248 kg</Text>
      </Box>
      <Box>
        <Text textAlign="center">25x2/20/10/1.25</Text>
      </Box>
    </Stack>
  )
}

function Section() {
  return (
    <>
      {/* <Box py="4">
        <Text fontSize="xl" color="white" fontWeight="bold">
          Settings
        </Text>
      </Box> */}
      <Accordion allowToggle color="white" fontSize="xl" pt="5">
        <AccordionItem>
          <AccordionButton px="0">
            <Box flex="1" textAlign="left" fontSize="xl">
              One Rep Max
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px="0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton px="0">
            <Box flex="1" textAlign="left" fontSize="xl">
              Available Plates
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px="0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton px="0">
            <Box flex="1" textAlign="left" fontSize="xl">
              Warmup Sets
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px="0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton px="0">
            <Box flex="1" textAlign="left" fontSize="xl">
              Units
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px="0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}
export default AppPage
