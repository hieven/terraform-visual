const ghpages = require('gh-pages')

ghpages.publish('out', { dotfiles: true }, (err) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Successfully published')
})
