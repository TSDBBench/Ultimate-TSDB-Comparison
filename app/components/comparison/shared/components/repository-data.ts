export class RepositoryData {
    constructor(public repository,
                public timestamp: Date,
                public latestCommit: Date) {
    }
}
