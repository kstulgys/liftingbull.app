import { useRef } from 'react'
import { useDisclosure, Flex, Button, Icon, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, DrawerFooter } from '@chakra-ui/core'
import { DrawerItemList } from './DrawerItemList'

export function AppDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure(false)
  const btnRef = useRef()

  return (
    <>
      <Flex>
        <Button ml="auto" bg="gray.900" variant="unstyled" onClick={onOpen} ref={btnRef}>
          <Icon name="drag-handle" transform="rotate(90deg)" size="10" color="cyan.300" />
        </Button>
      </Flex>

      <Drawer size="sm" isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent overflowY="auto" bg="gray.900" fontFamily="Montserrat" color="cyan.300">
          <DrawerCloseButton size="lg" mt="2" mr="1" />

          <DrawerBody m="0" px="0" mt="16">
            <DrawerItemList />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={() => {
                window.localStorage.clear()
                window.location.reload()
              }}
            >
              Reset
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
