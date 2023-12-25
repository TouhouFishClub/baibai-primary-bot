export type Rule = string | RegExp

export default class Plugin {
  public name: string
  private rule: Rule[]

  constructor(name: string, rule: Rule[]) {
    this.name = name
    this.rule = rule
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

  customMethod(context: any) {

  }
}