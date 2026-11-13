#!/usr/bin/env sh
# Regenerates database types for both apps after a migration.
#   supabase/scripts/gen-types.sh           # from the local stack (supabase start)
#   supabase/scripts/gen-types.sh --linked  # from the linked remote project
set -eu
cd "$(dirname "$0")/../.."
source_flag="${1:---local}"
supabase gen types typescript "$source_flag" --schema public > supabase/types/database.ts
cp supabase/types/database.ts portfolio/shared/database.ts
cp supabase/types/database.ts admin/shared/database.ts
echo "Types written to supabase/types, portfolio/shared and admin/shared."
