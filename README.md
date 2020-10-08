# Pokedex

This is a simple example repo to test out working with multiple small frontend app. The desire is to build out a pokemon app using the [pokeapi](https://pokeapi.co/) as the data source. It seems like the [micro frontend architecture](https://micro-frontends.org/) may be the future of frontend development. So this repo is a means to experiment and put together research gleaned over the past year on the topic.

## Goals of Project

* Host everything inside one repo. This means branches for different micro apps that will contain their branches for:
  * features
  * releases
  * bug fixes
  * **NOTE:** Of course this could be extended to other kinds of branches but the above seem pretty common.

## Git Branches

As part of the goal of hosting everything in one repo, below are some ideas of how to name the branches. The motivation behind the one repo is for situations where a repo is configured for Continuous Integration and QA type scanning tools. The idea would be to setup the repo one time and then [switch branches](https://github.com/ronbravo/pokedex/branches/all) while keeping the same settings.

```
// Using a short prefix, pkd = pokedex in this case.

app/pkd-catalog-ang8
app/pkd-catalog-nuxt
app/pkd-catalog-react

feature/pkd-catalog-ang8
feature/pkd-catalog-react15
feature/pkd-catalog-vue2
feature/pkd-catalog-nuxt3

release/pkd-catalog-nuxt3
bugfix/pkd-catalog-nuxt3
hotfix/pkd-catalog-nuxt3
```

Potentially ticket information could even be added to branch names for the sake of setting up a git workflow.

```
bugfix/pkd-catalog-vue3-TICKET-123-some-issue-ticket-summary
feature/pkd-catalog-react15-TICKET-123-some-issue-ticket-summary
release/pkd-catalog-ang8-v2.8.2
```

Another thought is to allow for branches to contain the build results. This is because certain repo hosting providers (ex: Github) can allow for npm to pull directly from those repos instead of npmjs.com default package repository.

```
release/pkd-catalog-react13-v1.8.1
release/pkd-catalog-js-v1.0.2
release/pkd-catalog-js-v2.8.2
```

After the above possibilities a satisfactory branch format would be:

```
<branch-type>/{prefix}-{app-name}-{framework}
<branch-type>/{prefix}-{app-name}-{framework}-{ticket-id}-{ticket-summary}
<branch-type>/{prefix}-{app-name}-{framework}-{release-version}
<branch-type>/{prefix}-{app-name}-{framework}-{extra-info...}
```

## Resources

Various links to help with building out the project.

### Misc

* [Awesome Micro Frontends](https://github.com/rajasegar/awesome-micro-frontends)
* [Awesome Micro Frontends 2](https://github.com/ChristianUlbrich/awesome-microfrontends)
* [NPM Tips](https://corgibytes.com/blog/2017/04/18/npm-tips/)
* [Live Server](https://www.npmjs.com/package/live-server)
* [Parcel](https://parceljs.org/) - Zero Config Bundler. Nice and smooth deving...
* [Awesome Parcel](https://github.com/parcel-bundler/awesome-parcel)
* [PokeDex](https://pokedex.org/#/)
* [PokeApi](https://pokeapi.co/)
