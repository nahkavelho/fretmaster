
type NoteDot = [number, number, string];

function GenDotList() {
  const noteStepx = 29
  const noteStepy = 36
  const numberOfPositions = 72
  const oneStringPositions = 12
  const FirstNoteX = 10
  const FirstNoteY = 0
  type Note = string
  const guitarNotes: Note[][] = [
    // 6th string (Low E)
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
    // 5th string (A)
    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
    // 4th string (D)
    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
    // 3rd string (G)
    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"],
    // 2nd string (B)
    ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    // 1st string (High E)
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
  ]

  const listOfPositions = Array.from({ length: numberOfPositions }, (_, index) => index)
  const dotCoordinates = listOfPositions.map((position) => {
    const x = ((FirstNoteX + (position % oneStringPositions) * noteStepx) / 100) * noteStepx
    const y = FirstNoteY + Math.floor(position / oneStringPositions) * noteStepy
    const note = guitarNotes[Math.floor(position / oneStringPositions)][position % oneStringPositions]
    return [x, y, note]
  })
  const randomIndex = Math.floor(Math.random() * dotCoordinates.length)
  return dotCoordinates[randomIndex] as NoteDot
}
export default GenDotList

export type { NoteDot }