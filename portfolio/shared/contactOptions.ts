/** Optional qualifiers on the contact form. Shared so the form and the API accept the same values. */
export const PROJECT_TYPES = [
  { value: 'website', label: 'Business or company website' },
  { value: 'web-app', label: 'Web app or internal tool' },
  { value: 'improve', label: 'Fix or improve an existing site' },
  { value: 'other', label: 'Something else' },
] as const

export const START_TIMES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'Within 1 to 3 months' },
  { value: 'exploring', label: 'Later, just exploring' },
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]['value']
export type StartTime = (typeof START_TIMES)[number]['value']

export const PROJECT_TYPE_VALUES = PROJECT_TYPES.map((option) => option.value) as [ProjectType, ...ProjectType[]]
export const START_TIME_VALUES = START_TIMES.map((option) => option.value) as [StartTime, ...StartTime[]]

export const labelFor = (options: readonly { value: string, label: string }[], value: string | undefined) =>
  options.find((option) => option.value === value)?.label
