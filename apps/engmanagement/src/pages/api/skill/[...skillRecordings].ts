import SkillRecordings, {
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'
import {nextAuthOptions} from '../auth/[...nextauth]'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  nextAuthOptions,
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export default SkillRecordings(skillOptions)
