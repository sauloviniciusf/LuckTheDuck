import { MessageEmbed } from "discord.js";

import { MONSTER_NAME_REGEX, OPTIONS_REGEX } from "../config/regex";

import { normalizeKeyValuePair } from "./normalizer";
import { isValueValid } from "./validate";
import { getRandomColor } from "./randomColor";

import { singleLineProperties } from "../config/botConfig";
import { BASE_MORE_INFO_URL } from "../config/generalConfig";

export const getParamsFromCommand = messageContent => {
  const normalizedMonsterName = messageContent
    .match(MONSTER_NAME_REGEX)
    .join("+")
    .toLowerCase();

  const additionalConfig = messageContent.match(OPTIONS_REGEX);

  const params = {
    name: normalizedMonsterName,
    isPrivate: additionalConfig.includes("private")
  };

  return params;
};

export const formatMonsterDataIntoMessage = monster => {
  const formatedMessage = new MessageEmbed();

  const { name, slug, ...monsterInfo } = monster;

  formatedMessage
    .setTitle(name)
    .setColor(getRandomColor())
    .setURL(`${BASE_MORE_INFO_URL}${slug}`);

  for (let [key, value] of Object.entries(monsterInfo)) {
    const [normalizedField, normalizedValue] = normalizeKeyValuePair(
      key,
      value
    );

    const shouldValueBeInline = !singleLineProperties.includes(key);

    if (isValueValid(normalizedValue)) {
      if (Array.isArray(normalizedValue)) {
        for (let [title, description] of normalizedValue) {
          formatedMessage.addField(title, description, shouldValueBeInline);
        }
      } else {
        formatedMessage.addField(
          normalizedField,
          normalizedValue,
          shouldValueBeInline
        );
      }
    }
  }

  return formatedMessage;
};