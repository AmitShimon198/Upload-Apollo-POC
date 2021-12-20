import { Query, Resolver, Arg, Mutation } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import csv from 'csv-parser';
import { ReadStream } from "fs";
@Resolver()
export class UploadResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }
  @Mutation(() => Boolean)
  async singleUpload(@Arg("file", () => GraphQLUpload) { createReadStream, filename }: FileUpload) {
    const parsedCsv = await this.parseCsv(createReadStream);
    console.log({ parsedCsv, filename });

    return true;
  }

  private async parseCsv(createReadStream: () => ReadStream) {
    const results: any[] = [];
    return await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results);
        }).on('error', () => reject('errs'));
    });
  }
}
