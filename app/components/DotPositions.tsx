
type NoteDot = [x: number, y: number, note: string, stringIndex: number, fretIndex: number];
type Note = string;

const ORIGINAL_STRING_VERTICAL_OFFSETS = [0, 0, 0, 0, 0, 0]; // Rolled back to 0 for mathematical centering. Was [0,0,0,0,0,-10]
const BASE_FRETBOARD_HEIGHT_FOR_OFFSETS = 140.0;
const ACTUAL_STRING_HEIGHTS = [1.4, 1.8, 2.2, 2.7, 3.5, 5]; // High E to Low E
// Each of the 6 strings has 13 notes (0-12 frets, where 0 is the open string)

const guitarNotes: Note[][] = [
  // 0th fret (open string)
  ["E","B","G","D","A","E"],
  // 1st fret
  ["F","C","G#","D#","A#","F"],
  // 2nd fret
  ["F#","C#","A","E","B","F#"],
  // 3rd fret
  ["G","D","A#","F","C","G"],
  // 4th fret
  ["G#","D#","B","F#","C#","G#"],
  // 5th fret
  ["A","E","C","G","D","A"],
  // 6th fret
  ["A#","F","C#","G#","D#","A#"],
  // 7th fret
  ["B","F#","D","A","E","B"],
  // 8th fret
  ["C","G","D#","A#","F","C"],
  // 9th fret
  ["C#","G#","E","B","F#","C#"],
  // 10th fret
  ["D","A","F","C","G","D"],
  // 11th fret
  ["D#","A#","F#","C#","G#","D#"],
  // 12th fret
  ["E","B","G","D","A","E"],
]

// Manually place a dot at a specific string and fret
function ManualDotPosition(
  fretboardHeight: number,
  numStrings: number,
  stringIndex: number,
  fretIndex: number,
  verticalOffset: number = 0,
  horizontalOffset: number = 0
): NoteDot {
  // Ensure indices are within valid ranges
  stringIndex = Math.max(0, Math.min(numStrings - 1, stringIndex));
  fretIndex = Math.max(0, Math.min(12, fretIndex));
  
  const noteStepx = 29;
  const FirstNoteX = 10;
  const DOT_SIZE = 16;
  
  // Each of the 6 strings has 13 notes (0-12 frets, where 0 is the open string)

  const marginPercent = 0.01;
  const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
  const gapCount = numStrings + 1;

  // stringIndex 0 (High E) is at the top, stringIndex 5 (Low E) is at the bottom.
  // This matches the visual rendering in Strings.tsx and the order of ORIGINAL_STRING_VERTICAL_OFFSETS.
  
  // Calculate string position (this positions the TOP of the string)
  const stringHeight = ACTUAL_STRING_HEIGHTS[stringIndex] || 2; // Use actual height for this string
  const stringTop = (marginPercent * fretboardHeight) + ((stringIndex + 1) / gapCount) * usableHeight - stringHeight / 2;
  
  // Position dot CENTERED on the string
  const stringMiddle = stringTop + (stringHeight / 2);
  
  // Apply vertical offset based on the string index
  let yOffset = verticalOffset;
  yOffset += getScaledStringOffset(stringIndex, fretboardHeight);
  
  const y = stringMiddle - (DOT_SIZE / 2) + yOffset;
  
  // X position (fret)
  let x;
  
  // Special case for fret 0 (open string) - position 10px to the left of fret 1
  if (fretIndex === 0) {
    // Calculate fret 1 position exactly as it would normally be calculated
    const fret1Position = ((FirstNoteX + 1 * noteStepx) / 100) * noteStepx;
    x = fret1Position - 10 - 1.5; // Add additional -1.5px offset for fret 0
  } else if (fretIndex === 1) {
    // Special case for fret 1 - apply a -8px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 8;
  } else {
    // For frets 2+ shift them back one position (fret 2 at old fret 1 position, etc.)
    x = ((FirstNoteX + (fretIndex - 1) * noteStepx) / 100) * noteStepx;
  }
  
  // Apply horizontal offset if provided
  x += horizontalOffset;
  
  const note = guitarNotes[fretIndex][stringIndex];  
  
  return [x, y, note, stringIndex, fretIndex];
}

function getScaledStringOffset(stringIndex: number, currentFretboardHeight: number): number {
  if (stringIndex < 0 || stringIndex >= ORIGINAL_STRING_VERTICAL_OFFSETS.length) {
    return 0; // Should not happen with valid stringIndex
  }
  const scaleFactor = currentFretboardHeight / BASE_FRETBOARD_HEIGHT_FOR_OFFSETS;
  return Math.round(ORIGINAL_STRING_VERTICAL_OFFSETS[stringIndex] * scaleFactor);
}

// Original random dot generator, with optional manual position
function GenDotList(
  fretboardHeight: number,
  numStrings: number,
  difficulty: number,
  manualString?: number,
  manualFret?: number,
  verticalOffset: number = 0,
  fullList?: boolean 
) {
  // If manual position is specified, use that instead of random
  if (manualString !== undefined && manualFret !== undefined ) {
    return ManualDotPosition(fretboardHeight, numStrings, manualString, manualFret, verticalOffset);
  }

  const noteStepx = 29;
  const numberOfPositions = [6,12,18,24,30,36,42,48,54,60,66,72,78];
  const FirstNoteX = 10;
  const DOT_SIZE = 16;

  // Match Strings.tsx EXACTLY
  const marginPercent = 0.01;
  const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
  const gapCount = numStrings + 1;

  const listOfPositions = Array.from({ length: numberOfPositions[difficulty] }, (_, index) => index);
  const dotCoordinates = listOfPositions.map((position) => {
    const fretIndex = Math.floor(position / numStrings)
    const stringIndex = position % numStrings
    // stringIndex 0 (High E) is at the top, stringIndex 5 (Low E) is at the bottom.
    // This matches the visual rendering in Strings.tsx and the order of ORIGINAL_STRING_VERTICAL_OFFSETS.
    
    // Use EXACT same formula as in Strings.tsx
    const stringHeight = ACTUAL_STRING_HEIGHTS[stringIndex] || 2; // Use actual height for this string
    const stringTop = (marginPercent * fretboardHeight) + ((stringIndex + 1) / gapCount) * usableHeight - stringHeight / 2;
    
    // Position dot CENTERED on the string (middle of dot over middle of string)
    // For perfect centering: string's center position - half the dot's height
    const stringMiddle = stringTop + (stringHeight / 2); // Middle of the string
    
    // Apply vertical offset based on the string index
    let yOffset = verticalOffset; // verticalOffset is the function parameter
    yOffset += getScaledStringOffset(stringIndex, fretboardHeight);
    
    const y = stringMiddle - (DOT_SIZE / 2) + yOffset;
    
    // X position (fret)
    let x;
    
    // Special case for fret 0 (open string) - position 10px to the left of fret 1
    if (fretIndex === 0) {
      // Calculate fret 1 position exactly as it would normally be calculated
      const fret1Position = ((FirstNoteX + 1 * noteStepx) / 100) * noteStepx;
      x = fret1Position - 10 - 1.5; // Add additional -1.5px offset for fret 0
    } else if (fretIndex === 1) {
      // Special case for fret 1 - apply a -8px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 8;
    } else {
      // For frets 2+ shift them back one position (fret 2 at old fret 1 position, etc.)
      x = ((FirstNoteX + (fretIndex - 1) * noteStepx) / 100) * noteStepx;
    }
    
    const note = guitarNotes[fretIndex][stringIndex]

    return [x, y, note, stringIndex, fretIndex]
  });

  if (fullList) {
    return dotCoordinates as any
  }
    return dotCoordinates[Math.floor(Math.random() * dotCoordinates.length)] as NoteDot

}

export default GenDotList
export { ManualDotPosition }
export type { NoteDot }
export type { Note }