<sup>[node-design-patterns](https://github.com/moatorres/node-design-patterns/blob/master/) / [clean-architecture](https://github.com/moatorres/node-design-patterns/blob/master/clean-architecture/) / [clean-arch-minimal](https://github.com/moatorres/node-design-patterns/blob/master/clean-architecture/clean-arch-minimal.md)</sup>

### Minimal clean architecture implementation in TypeScript

#### `Domain` namespace

```ts
namespace Domain {
  export class Hero {
    private constructor(private _name: string) {}
    get name(): string {
      return this._name
    }

    static create(name: string): [Hero, Error] {
      if (!name || name.trim().length < 3 || name.trim().length > 100) {
        return [null, new InvalidNameError(name)]
      }

      return [new Hero(name), null]
    }
  }

  export interface HeroRepository {
    getAll(): Promise<[Hero[], Error]>
    add(hero: Hero): Promise<[void, Error]>
    exists(name: String): Promise<[boolean, Error]>
  }

  export class HeroUsecases {
    constructor(private _heroRepo: HeroRepository) {}

    async getAll(): Promise<[Hero[], Error]> {
      return this._heroRepo.getAll()
    }

    async add(hero: Hero): Promise<[void, Error]> {
      const [exists, error] = await this._heroRepo.exists(hero.name)

      if (error != null) {
        return [, error]
      }

      if (exists) {
        return [, new AlreadyExistingHeroError(hero.name)]
      }

      return await this._heroRepo.add(hero)
    }
  }

  class InvalidNameError extends Error {
    constructor(heroName: string) {
      super(`The name "${heroName}" is not valid!`)
    }
  }

  class AlreadyExistingHeroError extends Error {
    constructor(name: string) {
      super(`The hero "${name}" already exists!`)
    }
  }
}
```

#### `Data` namespace

```ts
namespace Data {
  type HeroDTO = {
    name: string
  }

  class HeroDataMapper {
    static toDomain(heroDTO: HeroDTO): [Domain.Hero, Error] {
      return Domain.Hero.create(heroDTO.name)
    }

    static toDTO(hero: Domain.Hero): HeroDTO {
      return {
        name: hero.name,
      }
    }
  }

  export class HeroInMemoryRepository implements Domain.HeroRepository {
    private _heroes: HeroDTO[] = []

    async getAll(): Promise<[Domain.Hero[], Error]> {
      const result: Domain.Hero[] = []

      for (const h of this._heroes) {
        const [hero, error] = HeroDataMapper.toDomain(h)
        if (error == null) {
          result.push(hero)
        }
      }

      return [result, null]
    }

    async add(hero: Domain.Hero): Promise<[void, Error]> {
      const [exists, error] = await this.exists(hero.name)

      if (error != null) {
        return [null, error]
      }

      if (!exists) {
        const heroDTO = HeroDataMapper.toDTO(hero)
        this._heroes.push(heroDTO)
      }

      return [, null]
    }

    async exists(name: String): Promise<[boolean, Error]> {
      const exists =
        this._heroes.findIndex((item) => item.name === name) != -1
          ? true
          : false
      return [exists, null]
    }
  }
}
```

#### `View` namespace

```ts
namespace View {
  export type HeroViewModel = {
    name: string
  }

  class HeroViewModelMapper {
    static toDomain(heroViewModel: HeroViewModel): [Domain.Hero, Error] {
      return Domain.Hero.create(heroViewModel.name)
    }

    static toViewModel(hero: Domain.Hero): HeroViewModel {
      return {
        name: hero.name,
      }
    }
  }

  export class HeroController {
    constructor(private _heroUsecases: Domain.HeroUsecases) {}

    async listAll(): Promise<[HeroViewModel[], Error]> {
      try {
        const [heroes, error] = await this._heroUsecases.getAll()

        if (error != null) {
          return [null, error]
        }

        if (heroes.length == 0) {
          return [null, new EmptyListError()]
        }

        const heroesViewModel = heroes.map((item) =>
          HeroViewModelMapper.toViewModel(item)
        )

        return [heroesViewModel, null]
      } catch {
        return [null, new SystemError('Error to recovery heroes!')]
      }
    }

    async save(name: string): Promise<[void, Error]> {
      try {
        const heroViewModel: HeroViewModel = {
          name: name,
        }

        const [heroDomain, error] = HeroViewModelMapper.toDomain(heroViewModel)

        if (error != null) {
          return [, error]
        }

        return await this._heroUsecases.add(heroDomain)
      } catch {
        return [, new SystemError('Error to save hero!')]
      }
    }
  }

  class EmptyListError extends Error {
    constructor() {
      super(`The heroes list is empty!`)
    }
  }

  class SystemError extends Error {
    constructor(message: string) {
      super(message)
    }
  }
}
```

#### `userInterface` implementation

```ts
async function showUserInterface() {
  const heroRepo = new Data.HeroInMemoryRepository()
  const heroUsecases = new Domain.HeroUsecases(heroRepo)
  const controller = new View.HeroController(heroUsecases)

  var userInput

  do {
    userInput = prompt(
      'Type (1) to list all heroes; (2) to add one; or (3) to quit: '
    )

    switch (userInput) {
      case '1': {
        const [heroes, error] = await controller.listAll()

        if (error != null) {
          alert(`Erro: ${error.message}`)
        } else {
          let heroesStr = ''
          heroes.forEach((item) => (heroesStr += item.name + '\n'))

          alert(heroesStr)
        }
        break
      }
      case '2': {
        const heroName = prompt('Please type the hero name: ')
        const [, error] = await controller.save(heroName)

        if (error != null) {
          alert(`Erro: ${error.message}`)
        } else {
          alert(`New hero added!`)
        }

        break
      }
      case '3': {
        alert(`Goodbye!`)
        break
      }
      default: {
        alert(`Invalid option`)
      }
    }
  } while (userInput != '3')
}

// Main
showUserInterface()
```

### Credits

From this [gist](https://gist.github.com/pauloafpjunior/30b0b4cb0e9ccf0a471bf378aa531e50) written by [@pauloafpjunior](https://github.com/pauloafpjunior/)
