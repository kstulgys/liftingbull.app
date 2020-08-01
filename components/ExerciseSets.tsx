import { Stack, Box, Text, Accordion, AccordionItem, AccordionHeader, AccordionPanel, AccordionIcon } from '@chakra-ui/core'
import { getPlatesOnBar, getWorksetWeight } from '../utils'
import { useStore } from '../utils/store'

export function ExerciseSets({ exercise }) {
  const { plates, oneRepMax, units } = useStore((store) => store)
  if (!oneRepMax.length) return null

  const oneRM = oneRepMax?.find((item) => item.name === exercise.name)?.weight
  const oneRMWeight = units === 'kg' ? oneRM.kg : oneRM.lbs

  const currentPlates = units === 'kg' ? plates.kg : plates.lbs

  return (
    <Accordion allowToggle defaultIndex={[999]} allowMultiple>
      <WarmupSets exercise={exercise} oneRM={oneRMWeight} currentPlates={currentPlates} />
      <WorkSets exercise={exercise} oneRM={oneRMWeight} currentPlates={currentPlates} />
    </Accordion>
  )
}

function WorkSets({ exercise, oneRM, currentPlates }) {
  return (
    <AccordionItem fontWeight="bold" borderColor="gray.900">
      <AccordionHeader fontWeight="bold">
        <Box flex="1" textAlign="left">
          Work sets
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        <Stack>
          {exercise.sets.map(({ rpe, reps, id }, idx) => {
            const worksetWeight = getWorksetWeight(rpe, reps, oneRM)

            return (
              <Stack key={id} isInline>
                <Box flex="0.15">
                  <Text>{idx + 1}.</Text>
                </Box>
                <Box flex="0.6">
                  <Text>{worksetWeight}</Text>
                </Box>
                <Box flex="1">
                  <Text textAlign="center">{getPlatesOnBar(worksetWeight, 20, currentPlates)}</Text>
                </Box>
                <Box flex="0.15">
                  <Text textAlign="right">{reps}</Text>
                </Box>
              </Stack>
            )
          })}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  )
}

function WarmupSets({ exercise, oneRM, currentPlates }) {
  const { warmupSetsProps } = useStore((store) => store)

  const workSet = exercise.sets[0]
  const weight = oneRM && getWorksetWeight(workSet.rpe, workSet.reps, oneRM)

  return (
    <AccordionItem fontWeight="bold" _expanded={{ borderColor: 'gray.900' }} borderColor="gray.900">
      <AccordionHeader fontWeight="bold">
        <Box flex="1" textAlign="left">
          Warmup sets
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        <Stack>
          {weight &&
            warmupSetsProps?.map(({ percent, reps, id }, idx) => {
              const warmupWeight = Math.round(weight * percent)
              return (
                <Stack key={id} isInline>
                  <Box flex="0.15">
                    <Text>{idx + 1}.</Text>
                  </Box>
                  <Box flex="0.6">
                    <Text>
                      {Math.round(percent * 100)}% ({warmupWeight})
                    </Text>
                  </Box>
                  <Box flex="1">
                    <Text textAlign="center">{getPlatesOnBar(warmupWeight, 20, currentPlates)}</Text>
                  </Box>
                  <Box flex="0.15">
                    <Text textAlign="right">{reps}</Text>
                  </Box>
                </Stack>
              )
            })}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  )
}
