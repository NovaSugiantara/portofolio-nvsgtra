const yearFromDate = (date: string | null | undefined) => {
  const year = date?.slice(0, 4)
  return year && /^\d{4}$/.test(year) ? year : ''
}

export const formatYearRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  isExpected = false,
) => {
  const startYear = yearFromDate(startDate)
  const endYear = endDate ? yearFromDate(endDate) : startYear ? (isExpected ? 'Expected' : 'Present') : ''

  return [startYear, endYear].filter(Boolean).join(' — ')
}
