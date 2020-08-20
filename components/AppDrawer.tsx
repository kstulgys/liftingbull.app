import React, { useRef } from 'react'
import {
  Button as BaseButton,
  Stack,
  useDisclosure,
  Flex,
  Icon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from '@chakra-ui/core'
import { DrawerItemList } from './DrawerItemList'
import { useAuth } from '../utils/useAuth'
import { Button } from './lib'

export function AppDrawer() {
  const { signout, signInWithGoogle } = useAuth((state) => state.actions)
  const { isOpen, onOpen, onClose } = useDisclosure(false)
  const btnRef = useRef()

  return (
    <>
      <Flex>
        <BaseButton ml="auto" bg="gray.900" variant="unstyled" onClick={onOpen} ref={btnRef}>
          <Icon name="drag-handle" transform="rotate(90deg)" size="10" color="teal.300" />
        </BaseButton>
      </Flex>

      <Drawer size="sm" isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent overflowY="auto" bg="gray.900" fontFamily="Montserrat" color="teal.300">
          <DrawerCloseButton size="lg" mt="2" mr="1" />

          <DrawerBody m="0" px="0" mt="16">
            <DrawerItemList />
          </DrawerBody>

          <DrawerFooter p="2" mb="10">
            <Stack isInline spacing="5" alignItems="center" width="full">
              <Button fontSize="md" onClick={onClose} rounded="full">
                Close
              </Button>

              <Button fontSize="md" onClick={signout} rounded="full">
                Sign out
              </Button>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
