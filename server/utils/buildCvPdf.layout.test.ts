import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { wrapTextByWidth } from './buildCvPdf.ts'

const measureByCharacter = (text: string): number => text.length * 5

test('wrapTextByWidth keeps measured lines within the printable width', () => {
  const lines = wrapTextByWidth('short content with several words', 50, measureByCharacter)

  assert.deepEqual(lines, ['short', 'content', 'with', 'several', 'words'])
  assert.ok(lines.every((line) => measureByCharacter(line) <= 50))
})

test('wrapTextByWidth splits long unbroken content deterministically', () => {
  const lines = wrapTextByWidth('https://example.test/a-very-long-path', 40, measureByCharacter)

  assert.deepEqual(lines, ['https://', 'example.', 'test/a-v', 'ery-long', '-path'])
  assert.ok(lines.every((line) => measureByCharacter(line) <= 40))
})

test('wrapTextByWidth retains explicit blank lines', () => {
  assert.deepEqual(wrapTextByWidth('first\n\nlast', 100, measureByCharacter), ['first', '', 'last'])
})
