# Slide Content Development

This folder contains individual markdown files for each slide in the presentation. Each file details the content, speaker notes, visual elements, and examples needed for that slide.

## Structure

Each slide markdown follows this template:

```markdown
# Slide [Number]: [Title]

**Time:** [Start] - [End]
**Section:** [Introduction/Part 1/Part 2/etc.]

## Content Overview
[Brief description of slide purpose]

## What We'll Say
[Detailed speaker script/talking points]

## Visual Elements Needed
- [ ] [Diagram/image/screenshot description]
- [ ] [Animation/transition details]
- [ ] [Code blocks]

## Examples/Analogies
- [Specific examples to illustrate concept]
- [Analogies to make it relatable]

## Interactive Elements
- [Audience questions/polls]
- [Live demo steps]

## Notes/Considerations
- [Things to emphasize]
- [Common misconceptions to address]
- [Timing considerations]

## Breakdown Needed?
- [ ] Yes - this slide needs to be split into multiple slides
- [ ] No - content fits in single slide

If yes, proposed breakdown:
1. [New slide 1 focus]
2. [New slide 2 focus]
```

## Slide Numbering

Slides are numbered according to the outline.md file. If slides need to be broken down, use letter suffixes (e.g., Slide 5a, 5b, 5c).

## Status Tracking

Each slide file should have a status marker at the top:
- `[DRAFT]` - Initial content outlined
- `[REVIEW]` - Ready for review
- `[FINAL]` - Approved and ready for slide deck creation
- `[NEEDS BREAKDOWN]` - Too much content, needs splitting

## Workflow

1. Create initial markdown from outline.md content
2. Review and expand with detailed speaker notes
3. Identify visual needs (diagrams, images, code)
4. Add specific examples and analogies
5. Determine if slide needs breakdown
6. Mark as ready for visual design

## File Naming Convention

- `slide-01-title.md`
- `slide-02-the-mystery.md`
- `slide-03-secret-sauce.md`
- etc.

Use kebab-case for file names, matching the slide title.
