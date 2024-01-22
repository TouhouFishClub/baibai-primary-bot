export type Rule = string | RegExp

export default abstract class Plugin {
  public name: string
  public type: 'string' | 'object'
  protected rule: Rule[]
  protected whitelist: number[] = []
  protected blacklist: number[] = []


  constructor(name: string, rule: Rule[], type: 'string' | 'object') {
    this.name = name
    this.rule = rule
    this.type = type
  }

  setWhitelist(list: number[]) {
    this.whitelist = list
  }

  setBlacklist(list: number[]) {
    this.blacklist = list
  }

  isAllowed(groupNumber: number): boolean {
    if (this.blacklist.includes(groupNumber)) {
      return false
    }
    if (this.whitelist.length > 0 && !this.whitelist.includes(groupNumber)) {
      return false
    }
    return true
  }

  process(context: string | MessageSegment[]) {
    return this.rule.find((pattern) => {
      if(typeof context === 'string') {
        if (typeof pattern === 'string') {
          return context === pattern
        } else if (pattern instanceof RegExp) {
          return pattern.test(context)
        }
      } else {
        if (typeof pattern === 'string') {
          return context.filter(ms => ms.type === 'text' && ms.data.text === pattern).length > 0
        } else if (pattern instanceof RegExp) {
          return context.filter(ms => ms.type === 'text' && pattern.test(ms.data.text)).length > 0
        }
      }
      return false
    })
  }

  abstract entry(context: string | MessageSegment[]) : string | MessageSegment[] | Promise<string | MessageSegment[]>
}