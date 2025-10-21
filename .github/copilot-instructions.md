## MANDATORY: Project Structure Discovery Protocol

### Auto-execution at Session Start
The following commands MUST be executed automatically at the beginning of each session:

```bash
# 1. Check existing knowledge
mcp__serena__check_onboarding_performed
   mcp__serena__list_memories

# 2. Project structure scan
mcp__serena__list_dir({ relative_path: ".", recursive: false })
mcp__serena__get_symbols_overview({ relative_path: "src" })

# 3. Configuration files
mcp__serena__find_file({ file_mask: "package.json", relative_path: "." })
mcp__serena__find_file({ file_mask: "*.config.*", relative_path: "." })
```end

### Project-Specific Symbol Patterns
- **Vue Components**: Use `find_symbol("ComponentName/setup")` for Composition API
- **Legacy JS (public/js/)**: Use `search_for_pattern` for function literals
- **Services**: Use `find_symbol("*Service/*")` for service methods
- **Event Handlers**: Use `find_symbol` with patterns like "handle*", "on*"

### Serena Tool Priority
1. **For symbol/function search**: Always try `find_symbol` first
2. **For text/string search**: Use `search_for_pattern`
3. **For multiple replacements**: Use `replace_regex` when changing 3+ similar patterns

## First Session Memory Creation
On first project interaction, create these Serena memories:
- `project_structure.md`: Directory layout and file purposes
- `symbol_patterns.md`: Project naming conventions
- `tech_stack.md`: Technologies and configurations


