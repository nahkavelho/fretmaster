type NoteDot = [number, number, string, number, number];

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
  
  type Note = string;
  // Each of the 6 strings has 13 notes (0-12 frets, where 0 is the open string)
  const guitarNotes: Note[][] = [
    // 1st string (High E)
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
    // 2nd string (B)
    ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    // 3rd string (G)
    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"],
    // 4th string (D)
    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
    // 5th string (A)
    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
    // 6th string (Low E)
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
  ];

  const marginPercent = 0.01;
  const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
  const gapCount = numStrings + 1;

  // CRITICAL: Reverse the string index to match Strings.tsx
  const renderedIndex = (numStrings - 1) - stringIndex;
  
  // Calculate string position (this positions the TOP of the string)
  const stringHeight = 2;
  const stringTop = (marginPercent * fretboardHeight) + ((renderedIndex + 1) / gapCount) * usableHeight - stringHeight / 2;
  
  // Position dot CENTERED on the string
  const stringMiddle = stringTop + (stringHeight / 2);
  
  // Apply vertical offset based on the string index
  let yOffset = verticalOffset;
  // Add specific offsets for each string to ensure correct positioning
  switch (stringIndex) {
    case 0: yOffset += 26; break; // String 1 (high E)
    case 1: yOffset += 22; break; // String 2 (B)
    case 2: yOffset += 16; break; // String 3 (G)
    case 3: yOffset += 13; break; // String 4 (D)
    case 4: yOffset += 8;  break; // String 5 (A)
    case 5: yOffset += 4;  break; // String 6 (low E)
  }
  
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
  
  const note = guitarNotes[stringIndex][fretIndex];  
  
  return [x, y, note, stringIndex, fretIndex];
}

// Original random dot generator, with optional manual position
function GenDotList(
  fretboardHeight: number,
  numStrings: number,
  manualString?: number,
  manualFret?: number,
  verticalOffset: number = 0
) {
  // If manual position is specified, use that instead of random
  if (manualString !== undefined && manualFret !== undefined) {
    return ManualDotPosition(fretboardHeight, numStrings, manualString, manualFret, verticalOffset);
  }

  const noteStepx = 29;
  const numberOfPositions = [6,12,18,24,30,36,42,48,54,60,66,72,78];
  const oneStringPositions = 13;
  const FirstNoteX = 10;
  const DOT_SIZE = 16;
  type Note = string;
  // Each of the 6 strings has 13 notes (0-12 frets, where 0 is the open string)
  const guitarNotes: Note[][] = [
    // 1st string (High E)
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
    // 2nd string (B)
    ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    // 3rd string (G)
    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"],
    // 4th string (D)
    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
    // 5th string (A)
    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
    // 6th string (Low E)
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
  ];

  // Match Strings.tsx EXACTLY
  const marginPercent = 0.01;
  const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
  const gapCount = numStrings + 1;

  const listOfPositions = Array.from({ length: numberOfPositions[12] }, (_, index) => index);
  const dotCoordinates = listOfPositions.map((position) => {
    const fretIndex = position % oneStringPositions;
    const stringIndex = Math.floor(position / oneStringPositions);
    
    // CRITICAL: Reverse the string index to match Strings.tsx (this is in the Strings.tsx file)
    const renderedIndex = (numStrings - 1) - stringIndex;
    
    // Use EXACT same formula as in Strings.tsx
    const stringHeight = 2;
    const stringTop = (marginPercent * fretboardHeight) + ((renderedIndex + 1) / gapCount) * usableHeight - stringHeight / 2;
    
    // Position dot CENTERED on the string (middle of dot over middle of string)
    // For perfect centering: string's center position - half the dot's height
    const stringMiddle = stringTop + (stringHeight / 2); // Middle of the string
    
    // Apply vertical offset based on the string index
    let yOffset = verticalOffset;
    // Add specific offsets for each string to ensure correct positioning
    switch (stringIndex) {
      case 0: yOffset += 26; break; // String 1 (high E)
      case 1: yOffset += 22; break; // String 2 (B)
      case 2: yOffset += 16; break; // String 3 (G)
      case 3: yOffset += 13; break; // String 4 (D)
      case 4: yOffset += 8;  break; // String 5 (A)
      case 5: yOffset += 4;  break; // String 6 (low E)
    }
    
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
    
    const note = guitarNotes[stringIndex][fretIndex];
    console.log(`String: ${stringIndex}, Fret: ${fretIndex}, Note: ${note}`)
    return [x, y, note];
  });
  const randomIndex = Math.floor(Math.random() * dotCoordinates.length);
  return dotCoordinates[randomIndex] as NoteDot;
}

export default GenDotList;
export { ManualDotPosition };
export type { NoteDot };