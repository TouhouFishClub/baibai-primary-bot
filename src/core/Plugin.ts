import Bot from '@baibai/core/Bot'

export interface Rule {
  type: 'string' | 'regex'
  pattern: string | RegExp
}

export default class Plugin {
  public name: string
  private rule: Rule[]
  private bot: Bot | null

  constructor(name: string, rule: Rule[]) {
    this.name = name
    this.rule = rule
  }

  async process(context: any) {
    const matchedRule = this.rule.find((r) => {
      if (r.type === 'string' && typeof r.pattern === 'string') {
        return context === r.pattern
      } else if (r.type === 'regex' && r.pattern instanceof RegExp) {
        return r.pattern.test(context)
      }
      return false
    })

    if (matchedRule) {
      console.log(`Matched rule for ${this.name}:`, matchedRule)
      // let res = await this.customMethod(context)
    } else {
      console.log(`No matched rule found for ${this.name}`)
    }
  }

  injectBot(bot: Bot) {
    this.bot = bot
  }

  customMethod(context: any) {

  }
}