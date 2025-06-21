food_env_file="workspaces/services/food-service/.env"
tag_env_file="workspaces/services/tag-service/.env"

env:
	npx dotenv -e .env make write-env

write-env:
	echo "APP_ENV=${APP_ENV}" > ${food_env_file}
	echo "PORT=${FOOD_SERVICE__PORT}" >> ${food_env_file}
	echo "DATABASE_URL=${FOOD_SERVICE__DATABASE_URL}" >> ${food_env_file}

	echo "APP_ENV=${APP_ENV}" > ${tag_env_file}
	echo "PORT=${TAG_SERVICE__PORT}" >> ${tag_env_file}
	echo "DATABASE_URL=${TAG_SERVICE__DATABASE_URL}" >> ${tag_env_file}

prisma-generate:
	npx lerna run prisma:generate

setup:
	npm i
	npx lerna run prisma:generate
	make env

dev:
	npx dotenv -e .env npx lerna run dev

typecheck:
	npx lerna run typecheck

test: 
	APP_ENV=test npx jest

lint-fix:
	eslint ./workspaces --ext ts,tsx --report-unused-disable-directives --max-warnings 0 --fix & prettier ./workspaces --write

lint:
	eslint ./workspaces --ext ts,tsx --report-unused-disable-directives --max-warnings=0 --quiet && prettier ./workspaces --check --log-level=warn
