// Static image manifest — require() must be static for Metro bundler.
// Maps imageKey → bundled asset. Falls back to Ionicon if key is absent.
const TILE_IMAGES: Record<string, any> = {
  want:   require('./tiles/want.jpg'),
  more:   require('./tiles/more.jpg'),
  go:     require('./tiles/go.jpg'),
  stop:   require('./tiles/stop.jpg'),
  help:   require('./tiles/help.jpg'),
  yes:    require('./tiles/yes.jpg'),
  no:     require('./tiles/no.jpg'),
  i:      require('./tiles/i.jpg'),
  you:    require('./tiles/you.jpg'),
  like:   require('./tiles/like.jpg'),
  play:   require('./tiles/play.jpg'),
  eat:    require('./tiles/eat.jpg'),
  drink:  require('./tiles/drink.jpg'),
  sleep:  require('./tiles/sleep.jpg'),
  done:   require('./tiles/done.jpg'),
  happy:  require('./tiles/happy.jpg'),
  sad:    require('./tiles/sad.jpg'),
  angry:  require('./tiles/angry.jpg'),
  mom:    require('./tiles/mom.jpg'),
  dad:    require('./tiles/dad.jpg'),
  apple:  require('./tiles/apple.jpg'),
  water:  require('./tiles/water.jpg'),
  milk:   require('./tiles/milk.jpg'),
  school: require('./tiles/school.jpg'),
  book:   require('./tiles/book.jpg'),
};

export default TILE_IMAGES;
