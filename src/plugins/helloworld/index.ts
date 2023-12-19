const HelloWorld = (context: string): string  => {
  if(context === 'hello')
    return 'world'
}

module.exports = {
  HelloWorld
}