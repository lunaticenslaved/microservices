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

setup:
	npm i
	npx lerna run prisma:generate
	make env

dev:
	npx dotenv -e .env npx lerna run dev
