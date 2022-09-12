import React from 'react'
import LessonTemplate from 'templates/lesson-template'
import {GetServerSideProps} from 'next'
import {getTutorial} from 'lib/tutorials'
import {getLesson} from 'lib/lessons'
import {getExercise} from '../../../../lib/exercises'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string

  const subscriber = context.req.cookies['ck_subscriber'] || null
  const tutorial = await getTutorial(params?.module as string)
  const lesson = await getExercise(lessonSlug)

  if (!lesson) {
    return {
      notFound: true,
    }
  }

  if (subscriber || lesson.isFree) {
    return {
      props: {lesson, tutorial, subscriber, isSolution: true},
    }
  }
  const {video, ...blockedNoVideoLesson} = lesson

  return {
    props: {lesson: blockedNoVideoLesson, tutorial, isSolution: true},
  }
}

const LessonSolution: React.FC<any> = ({
  lesson,
  tutorial,
  subscriber,
  isSolution,
}) => {
  return (
    <LessonTemplate
      lesson={lesson}
      module={tutorial}
      subscriber={subscriber}
      isSolution={isSolution}
    />
  )
}

export default LessonSolution