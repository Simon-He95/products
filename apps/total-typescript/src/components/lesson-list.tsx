import React from 'react'
import {SanityDocument} from '@sanity/client'
import {track} from '../utils/analytics'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'
import {Exercise} from '../lib/exercises'
import Image from 'next/image'

const LessonList: React.FC<{
  module: SanityDocument
  section?: SanityDocument
  path: string
}> = ({module, section, path}) => {
  const router = useRouter()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const activeElRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const activeElTop: any = activeElRef.current?.offsetTop
    const scrollContainerTop: any = scrollContainerRef.current?.offsetTop
    scrollContainerRef.current?.scrollTo({
      top: activeElTop - scrollContainerTop,
    })
  }, [router])

  const exercises = section ? section.exercises : module.exercises
  const hasSectionResources = section?.resources?.length > 0

  return (
    <div
      ref={scrollContainerRef}
      className="group relative h-[400px] overflow-y-auto pb-16 scrollbar-thin scrollbar-thumb-gray-800/70 hover:scrollbar-thumb-gray-700 lg:h-[calc(100vh-180px)]"
    >
      <nav aria-label="exercise navigator" className="pb-3">
        <ul className="flex flex-col divide-y divide-gray-800/0 text-lg">
          {exercises?.map((exercise: Exercise, sectionIdx: number) => {
            //TODO treat this differently when a section is present as path will change
            const currentPath = section
              ? `${path}/${module.slug.current}/${section.slug}/${exercise.slug}`
              : `${path}/${module.slug.current}/${exercise.slug}`
            const isActive = router.asPath === currentPath
            const scrollToElement =
              router.asPath === `${currentPath}/solution` ||
              router.asPath === currentPath

            return (
              <li key={exercise.slug} className="pt-2">
                {scrollToElement && (
                  <div ref={activeElRef} aria-hidden="true" />
                )}
                <Link
                  href={{
                    pathname: section
                      ? `${path}/[module]/[section]/[exercise]`
                      : `${path}/[module]/[exercise]`,
                    query: {
                      module: module.slug.current,
                      exercise: exercise.slug,
                      ...(section && {section: section.slug}),
                    },
                  }}
                  passHref
                >
                  <a
                    className="flex items-center px-4 py-2 font-semibold leading-tight hover:bg-gray-800"
                    onClick={() => {
                      track('clicked exercise in navigator', {
                        module: module.slug.current,
                        ...(section && {section: section.slug}),
                        lesson: exercise.slug,
                        moduleType: module.moduleType,
                        lessonType: exercise._type,
                      })
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="pr-3 text-sm opacity-50"
                    >
                      {sectionIdx + 1}
                    </span>{' '}
                    {exercise.title}
                  </a>
                </Link>
                {exercise._type === 'exercise' && (
                  <ul className="text-gray-300">
                    <li key={exercise.slug + `exercise`}>
                      <Link
                        href={{
                          pathname: section
                            ? `${path}/[module]/[section]/[exercise]`
                            : `${path}/[module]/[exercise]`,
                          query: {
                            module: module.slug.current,
                            exercise: exercise.slug,
                            ...(section && {section: section.slug}),
                          },
                        }}
                        passHref
                      >
                        <a
                          className={cx(
                            'flex items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-slate-400/20 hover:text-white',
                            {
                              'border-orange-400 bg-gray-800/80 text-white':
                                isActive,
                              'border-transparent ': !isActive,
                            },
                          )}
                          onClick={() => {
                            track(`clicked exercise in navigator`, {
                              module: module.slug.current,
                              lesson: exercise.slug,
                              ...(section && {section: section.slug}),
                              location: router.query.lesson,
                              moduleType: module.moduleType,
                              lessonType: exercise._type,
                            })
                          }}
                        >
                          Problem
                        </a>
                      </Link>
                    </li>
                    <SolutionLink
                      module={module}
                      exercise={exercise}
                      section={section}
                      path={path}
                    />
                  </ul>
                )}
                {exercise._type === 'explainer' && (
                  <ul className="text-gray-300">
                    <li key={exercise.slug + `exercise`}>
                      <Link
                        href={{
                          pathname: section
                            ? `${path}/[module]/[section]/[exercise]`
                            : `${path}/[module]/[exercise]`,
                          query: {
                            module: module.slug.current,
                            exercise: exercise.slug,
                            ...(section && {section: section.slug}),
                          },
                        }}
                        passHref
                      >
                        <a
                          className={cx(
                            'flex items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-slate-400/20 hover:text-white',
                            {
                              'border-indigo-400 bg-gray-800/80 text-white':
                                isActive,
                              'border-transparent ': !isActive,
                            },
                          )}
                          onClick={() => {
                            track(`clicked explainer in navigator`, {
                              module: module.slug.current,
                              lesson: exercise.slug,
                              ...(section && {section: section.slug}),
                              location: router.query.lesson,
                              moduleType: module.moduleType,
                              lessonType: exercise._type,
                            })
                          }}
                        >
                          Explainer
                        </a>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
      {hasSectionResources && (
        <nav
          aria-label="resource navigator"
          className="border-t border-gray-800 py-1"
        >
          <p className="px-5 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-gray-300">
            Section Resources
          </p>
          <ul className="flex flex-col divide-y divide-gray-800/0 text-lg">
            {section?.resources?.map(
              (resource: SanityDocument, resourceIdx: number) => {
                return (
                  <li key={resource.slug} className="pt-2">
                    <Link href={resource.url} passHref>
                      <a
                        className="flex items-center px-4 py-2 font-semibold leading-tight hover:bg-gray-800"
                        onClick={() => {
                          track('clicked link resource in navigator', {
                            module: module.slug.current,
                            ...(section && {section: section.slug}),
                            lesson: router.asPath.split('/').pop(),
                            moduleType: module.moduleType,
                            resource: resource.slug,
                          })
                        }}
                        target="_blank"
                      >
                        <span
                          aria-hidden="true"
                          className="pr-3 text-sm opacity-50"
                        >
                          ∙
                        </span>{' '}
                        {resource.title}
                      </a>
                    </Link>
                    <p className="pl-10 pr-3 text-sm text-gray-400">
                      {resource.description}
                    </p>
                  </li>
                )
              },
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}

const SolutionLink = ({
  module,
  section,
  exercise,
  path,
}: {
  module: SanityDocument
  section?: SanityDocument
  exercise: Exercise
  path: string
}) => {
  const router = useRouter()
  const solution = exercise.solution
  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${exercise.slug}/solution`
    : `${path}/${module.slug.current}/${exercise.slug}/solution`
  const isActive = router.asPath === currentPath
  return (
    <li key={solution?._key}>
      <Link
        href={{
          pathname: section
            ? `${path}/[module]/[section]/[exercise]/solution`
            : `${path}/[module]/[exercise]/solution`,
          query: {
            module: module.slug.current,
            exercise: exercise.slug,
            ...(section && {section: section.slug}),
          },
        }}
        passHref
      >
        <a
          className={cx(
            'flex items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-slate-400/20 hover:text-white',
            {
              'border-cyan-400 bg-gray-800/80 text-white': isActive,
              'border-transparent ': !isActive,
            },
          )}
          onClick={() => {
            track(`clicked solution in navigator`, {
              module: module.slug.current,
              lesson: exercise.slug,
              moduleType: module.moduleType,
              lessonType: exercise._type,
              ...(section && {section: section.slug}),
            })
          }}
        >
          {capitalize(solution?._type)}
        </a>
      </Link>
    </li>
  )
}
export default LessonList
