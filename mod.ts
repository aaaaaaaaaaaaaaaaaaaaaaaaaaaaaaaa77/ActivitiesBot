import * as slash from 'https://raw.githubusercontent.com/DjDeveloperr/harmony/slash/deploy.ts';
import { ChannelTypes } from 'https://raw.githubusercontent.com/DjDeveloperr/harmony/slash/src/types/channel.ts';

slash.init({ env: true });

const ACTIVITIES: {
  [name: string]: {
    id: string;
    name: string;
  };
} = {
  poker: {
    id: "755827207812677713",
    name: "Poker Night",
  },
  betrayal: {
    id: "773336526917861400",
    name: "Betrayal.io",
  },
  youtube: {
    id: "755600276941176913",
    name: "YouTube Together",
  },
  fishing: {
    id: "814288819477020702",
    name: "Fishington.io",
  },
};

slash.commands.all().then(e => {
  if (e.size === 0) {
    slash.commands.bulkEdit([
      {
        name: "invite",
        description: "Invite me to your server.",
      },
      {
        name: "activity",
        description: "Start an Activity in a Voice Channel.",
        options: [
          {
            name: "channel",
            type: slash.SlashCommandOptionType.CHANNEL,
            description: "Voice Channel to start activity in.",
            required: true,
          },
          {
            name: "activity",
            type: slash.SlashCommandOptionType.STRING,
            description: "Activity to start.",
            required: true,
            choices: Object.entries(ACTIVITIES).map((e) => ({
              name: e[1].name,
              value: e[0],
            })),
          },
        ],
      },
    ])
  }
});

slash.handle('activity', (d) => {
  if (!d.guild) return;
  const channel = d.option<slash.InteractionChannel>("channel");
  const activity = ACTIVITIES[d.option<string>("activity")];
  if (!channel || !activity) return d.reply("Invalid interaction.");
  if (channel.type !== ChannelTypes.GUILD_VOICE)
    return d.reply("Activities can only be started in Voice Channels.");

  slash.client.rest.api.channels[channel.id].invites
    .post({
      max_age: 604800,
      max_uses: 0,
      target_application_id: activity.id,
      target_type: 2,
      temporary: false,
    })
    .then((inv) => {
      d.reply(
        `[Click here to start ${activity.name} in ${channel.name}.](<https://discord.gg/${inv.code}>)`
      );
    })
    .catch((e) => {
      console.log(e);
      d.reply("Failed to start Activity.");
    });
});

slash.handle('invite', (d) => {
  d.reply(`[Click here to invite.](https://discord.com/api/oauth2/authorize?client_id=819835984388030464&permissions=1&scope=bot%20applications.commands)`);
});
