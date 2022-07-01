#!/bin/bash

TEXT="Тестирование выполнено: (☉_☉) %0A%0AProject:+$CI_PROJECT_NAME%0AURL:+$CI_PROJECT_URL/pipelines/$CI_PIPELINE_ID/%0ABranch:+$CI_COMMIT_REF_SLUG%0A
отчет: https://belkos.gitlab.io/sw-aqa/"

curl -s -X POST https://api.telegram.org/$TELEGRAM_BOT_TOKEN/sendMessage -d chat_id=$TELEGRAM_USER_ID -d text="$TEXT"

# curl -s -X POST https://api.telegram.org/$TELEGRAM_BOT_TOKEN/sendMessage -d chat_id=$TELEGRAM_USER_ID -d text="https://belkos.gitlab.io/tikit-aqa/"