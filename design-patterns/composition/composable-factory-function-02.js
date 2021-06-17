const pipe =
  (...fns) =>
  (a) =>
    fns.reduce((y, f) => f(y), a)

const response = JSON.stringify({
  channel: 'output-2',
  shows: [
    {
      name: 'Spongebob',
      start: 1561867200000,
      end: 1561869000000,
    },
    {
      name: 'Rick & Morty',
      start: 1561867200000,
      end: 1561869000000,
    },
    {
      name: 'Law & Order',
      start: 1561867200000,
      end: 1561869000000,
    },
  ],
})

// add duration(ms) for all shows in API response
const addDuration = (response) => {
  const formattedShows = response.shows.map((show) => ({
    duration: show.end - show.start,
    ...show,
  }))
  return {
    ...response,
    shows: formattedShows,
  }
}

// add channel name for all shows in API response
const addChannel = (channelMap) => (response) => {
  const match = channelMap.find((channel) => channel.code === response.channel)
  return {
    channelName: match.name,
    ...response,
  }
}

const CHANNEL_MAP = [
  { code: 'output-1', name: 'music' },
  { code: 'output-2', name: 'news' },
  { code: 'output-3', name: 'kids' },
]

const CHANNEL_MAP_BRANDED = [
  { code: 'output-1', name: 'MTV' },
  { code: 'output-2', name: 'Sky' },
  { code: 'output-3', name: 'Nickelodeon' },
]

const formatShows = (channelMap, payload) =>
  pipe(JSON.parse, addDuration, addChannel(channelMap))(payload)

const formattedShows = formatShows(CHANNEL_MAP, response)
console.log(formattedShows)

const brandedShows = formatShows(CHANNEL_MAP_BRANDED, response)
console.log(brandedShows)
