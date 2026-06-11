# Skill Registry — next-proxy-web

Last updated: 2026-06-11

## Instructions

This registry maps available LLM skills by trigger and path. Subagents receive exact paths
and read the full SKILL.md source of truth — this is an index, not a summary.

## User-Level Skills (`~/.config/opencode/skills/`)

| Skill | Trigger | Path |
|---|---|---|
| branch-pr | creating, opening, or preparing PRs for review | `~/.config/opencode/skills/branch-pr/SKILL.md` |
| chained-pr | PRs over 400 lines, stacked PRs, review slices | `~/.config/opencode/skills/chained-pr/SKILL.md` |
| cognitive-doc-design | writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs | `~/.config/opencode/skills/cognitive-doc-design/SKILL.md` |
| comment-writer | PR feedback, issue replies, reviews, Slack messages, or GitHub comments | `~/.config/opencode/skills/comment-writer/SKILL.md` |
| go-testing | Go tests, go test coverage, Bubbletea teatest, golden files | `~/.config/opencode/skills/go-testing/SKILL.md` |
| issue-creation | creating GitHub issues, bug reports, or feature requests | `~/.config/opencode/skills/issue-creation/SKILL.md` |
| judgment-day | judgment day, dual review, adversarial review, juzgar | `~/.config/opencode/skills/judgment-day/SKILL.md` |
| skill-creator | new skills, agent instructions, documenting AI usage patterns | `~/.config/opencode/skills/skill-creator/SKILL.md` |
| skill-improver | improve skills, audit skills, refactor skills, skill quality | `~/.config/opencode/skills/skill-improver/SKILL.md` |
| work-unit-commits | implementation, commit splitting, chained PRs, or keeping tests and docs with code | `~/.config/opencode/skills/work-unit-commits/SKILL.md` |

## User-Level Skills (`~/.agents/skills/`)

### Utilities

| Skill | Trigger | Path |
|---|---|---|
| find-skills | discovering and installing agent skills | `~/.agents/skills/utilities/find-skills/SKILL.md` |

### Godot

| Skill | Trigger | Path |
|---|---|---|
| godot-2d-animation | AnimatedSprite2D, skeletal cutout, frame animation, procedural animation | `~/.agents/skills/godot/godot-2d-animation/SKILL.md` |
| godot-asset-generator | game assets, AI art, DALL-E, Replicate, fal.ai, sprite sheet, tileset | `~/.agents/skills/godot/godot-asset-generator/SKILL.md` |
| godot-audio-systems | AudioStreamPlayer, AudioBus, AudioEffect, music_crossfade, audio_pool | `~/.agents/skills/godot/godot-audio-systems/SKILL.md` |
| godot-best-practices | Godot 4.x GDScript, scene organization, signals, resources, state machines | `~/.agents/skills/godot/godot-best-practices/SKILL.md` |
| godot-composition | entity-component, gameplay, actors, NPCs, enemies, weapons, ECS | `~/.agents/skills/godot/godot-composition/SKILL.md` |
| godot-debugging | Godot debugging, error interpretation, common bugs, troubleshooting | `~/.agents/skills/godot/godot-debugging/SKILL.md` |
| godot-development | Godot Engine, scene creation, node management, GDScript programming | `~/.agents/skills/godot/godot-development/SKILL.md` |
| godot-gdscript-patterns | Godot 4 GDScript patterns, signals, scenes, state machines, optimization | `~/.agents/skills/godot/godot-gdscript-patterns/SKILL.md` |
| godot-master | starting a Godot project, architecture, entity/component, debugging, multiplayer, optimization | `~/.agents/skills/godot/godot-master/SKILL.md` |
| godot-mcp-scene-builder | MCP, scene automation, programmatic scene building, node hierarchy | `~/.agents/skills/godot/godot-mcp-scene-builder/SKILL.md` |
| godot-optimization | Godot performance optimization, profiling, bottleneck identification | `~/.agents/skills/godot/godot-optimization/SKILL.md` |
| godot-particles | GPUParticles2D/3D, ParticleProcessMaterial, VFX, explosions, weather, trails | `~/.agents/skills/godot/godot-particles/SKILL.md` |
| godot-save-load-systems | save, load, JSON, FileAccess, serialization, version migration, PERSIST group | `~/.agents/skills/godot/godot-save-load-systems/SKILL.md` |
| godot-shaders-basics | shader, GLSL, fragment, vertex, canvas_item, spatial, post-processing | `~/.agents/skills/godot/godot-shaders-basics/SKILL.md` |
| godot-ui | Godot UI, Control nodes, themes, styling, responsive layouts | `~/.agents/skills/godot/godot-ui/SKILL.md` |
| godot-ui-theming | Theme, StyleBox, StyleBoxFlat, font, theme inheritance, dark mode | `~/.agents/skills/godot/godot-ui-theming/SKILL.md` |

## Built-In / Env Skills

| Skill | Trigger | Path |
|---|---|---|
| customize-opencode | editing or creating opencode's own configuration | built-in |

## Project-Level Skills

None found.

## Project Convention Files

None found (no AGENTS.md, CLAUDE.md, .cursorrules, or equivalent).

## Excluded from Index

- `sdd-init`, `sdd-propose`, `sdd-spec`, `sdd-design`, `sdd-tasks`, `sdd-apply`, `sdd-verify`, `sdd-archive`, `sdd-explore`, `sdd-onboard`
- `_shared`
- `skill-registry`
