import { Button as BaseButton, Select as BaseSelect } from '@chakra-ui/core'

export function Button(props) {
  return (
    <BaseButton
      width="full"
      size="lg"
      rounded="full"
      fontSize="xl"
      border="4px solid"
      borderColor="cyan.300"
      fontWeight="bold"
      variant="ghost"
      color="cyan.300"
      _hover={{
        bg: 'cyan.300',
        color: 'gray.900',
      }}
      {...props}
    />
  )
}

export function Select(props) {
  return (
    <BaseSelect
      size="lg"
      fontSize="lg"
      style={{
        textAlignLast: 'center',
      }}
      backgroundColor="gray.900"
      borderColor="gray.900"
      fontWeight="bold"
      _hover={{
        borderColor: 'gray.900',
      }}
      {...props}
    />
  )
}
