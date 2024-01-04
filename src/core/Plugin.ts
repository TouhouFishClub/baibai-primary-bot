export type Rule = string | RegExp

export default class Plugin {
  public name: string
  protected rule: Rule[]
  protected whitelist: number[] = []
  protected blacklist: number[] = []


  constructor(name: string, rule: Rule[]) {
    this.name = name
    this.rule = rule
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

  process(context: any) {
    return this.rule.find((pattern) => {
      if (typeof pattern === 'string') {
        return context === pattern
      } else if (pattern instanceof RegExp) {
        return pattern.test(context)
      }
      return false
    })
  }

  entry(context: any) {

  }
}