import {SanityDocument} from '@sanity/client'
import {Exercise} from 'lib/exercises'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

export const getNextExercise = (
  module: SanityDocument,
  currentLesson: Exercise,
) => {
  if (currentLesson._type === 'exercise') {
    return currentLesson.solution
  }

  const exerciseForSolution = module.exercises.find(
    (resource: SanityDocument) => {
      return resource.solution?._key === currentLesson._key
    },
  )

  const current = find(module.exercises, {_id: exerciseForSolution._id})
  const nextExerciseIndex = indexOf(module.exercises, current) + 1
  const nextExercise = module.exercises[nextExerciseIndex]
  return nextExercise
}
