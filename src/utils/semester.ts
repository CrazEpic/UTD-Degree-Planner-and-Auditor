import { SemesterTerm } from "../types/degreeTest"

export const semesterFromDate = (date: Date): { term: SemesterTerm.SPRING | SemesterTerm.SUMMER | SemesterTerm.FALL; year: number } => {
	const springSemesterStart = new Date(date.getFullYear(), 0)
	const springSemesterEnd = new Date(date.getFullYear(), 4, 31)
	const summerSemesterStart = new Date(date.getFullYear(), 5)
	const summerSemesterEnd = new Date(date.getFullYear(), 7, 24)
	// const fallSemesterStart = new Date(date.getFullYear(), 8)
	// const fallSemesterEnd = new Date(date.getFullYear(), 11, 31)
	if (date >= springSemesterStart && date <= springSemesterEnd) {
		return { term: SemesterTerm.SPRING, year: date.getFullYear() }
	} else if (date >= summerSemesterStart && date <= summerSemesterEnd) {
		return { term: SemesterTerm.SUMMER, year: date.getFullYear() }
	} else {
		return { term: SemesterTerm.FALL, year: date.getFullYear() }
	}
}

export const getNextSemester = (currentSemester: SemesterTerm.SPRING | SemesterTerm.SUMMER | SemesterTerm.FALL, currentYear: number) => {
	if (currentSemester === SemesterTerm.FALL) {
		return { term: SemesterTerm.SPRING, year: currentYear + 1 }
	} else if (currentSemester === SemesterTerm.SPRING) {
		return { term: SemesterTerm.SUMMER, year: currentYear }
	} else {
		return { term: SemesterTerm.FALL, year: currentYear }
	}
}

export const getPreviousSemester = (currentSemester: SemesterTerm.SPRING | SemesterTerm.SUMMER | SemesterTerm.FALL, currentYear: number) => {
	if (currentSemester === SemesterTerm.FALL) {
		return { term: SemesterTerm.SUMMER, year: currentYear }
	} else if (currentSemester === SemesterTerm.SPRING) {
		return { term: SemesterTerm.FALL, year: currentYear - 1 }
	} else {
		return { term: SemesterTerm.SPRING, year: currentYear }
	}
}

export const compareSemesters = (
	semester1: { term: SemesterTerm.SPRING | SemesterTerm.SUMMER | SemesterTerm.FALL; year: number },
	semester2: { term: SemesterTerm.SPRING | SemesterTerm.SUMMER | SemesterTerm.FALL; year: number }
) => {
	if (semester1.year != semester2.year) {
		return semester1.year - semester2.year
	}
	/* 
	enum SemesterTerm {
		FALL = 0,
		SPRING = 1,
		SUMMER = 2,
	}
	*/
	return semester1.term - semester2.term
}

export const stringFromTerm = (term: SemesterTerm) => {
	if (term === SemesterTerm.FALL) {
		return "FALL"
	} else if (term === SemesterTerm.SPRING) {
		return "SPRING"
	} else {
		return "SUMMER"
	}
}

export const getAllSemestersFromStartToEnd = (
	startSemester: { term: SemesterTerm.SPRING | SemesterTerm.SUMMER | SemesterTerm.FALL; year: number },
	endSemester: { term: SemesterTerm.SPRING | SemesterTerm.SUMMER | SemesterTerm.FALL; year: number }
) => {
	const allSemesters = []
	let semesterCounter = startSemester
	while (compareSemesters(semesterCounter, endSemester) <= 0) {
		allSemesters.push(`${stringFromTerm(semesterCounter.term)} ${semesterCounter.year}`)
		semesterCounter = getNextSemester(semesterCounter.term, semesterCounter.year)
	}
	return allSemesters
}
