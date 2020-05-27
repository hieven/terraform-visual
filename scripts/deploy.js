const ghpages = require('gh-pages')

ghpages.publish('out', { dotfiles: true }, (err) => {
  if (err) {
    console.log(err)
  }

  console.log('Successfully published')
})
