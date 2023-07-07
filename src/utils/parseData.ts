import { ZodType, z } from "zod";

/**
 * Function to get the data from the body of a request and validate it
 *
 * @export
 * @param {Request} req
 * @param {ZodType} schema
 * 
 * @return {Promise<null | z.infer<Schema>>}
 * Returns either:
 *  - null if the data could not be passed
 * or
 *  - returns the data in the body if it fits the schema passed to the function
 */
export async function getBodyData<Schema extends z.ZodTypeAny> (req: Request, schema: Schema): Promise<null | z.infer<Schema>> {
  const body = await req.json();
  const parsedData = await schema.safeParseAsync(body);

  if (!parsedData.success) {
    return null
  } else {
    return parsedData.data
  }
}

/**
 *  Function to get validate the data parsed into it
 *
 * @export
 * @param {*} data
 * @param {ZodType} schema
 * 
 * @return {Promise<null | z.infer<Schema>>}
 * Returns either:
 *  - null if the data could not be passed
 * or
 *  - returns the data in the body if it fits the schema passed to the function 
 */
export async function validateData<Schema extends z.ZodTypeAny> (data: any, schema: Schema): Promise<null | z.infer<Schema>> {
  const parsedData = await schema.safeParseAsync(data);

  if (!parsedData.success) {
    return null
  } else {
    return parsedData.data
  }
}

export function getNumSearchParam(req: Request, param: string) {
  const { searchParams } = new URL(req.url);
  const paramVal = searchParams.get(param);
  if (paramVal == null) {
    return 0;
  } else {
    return Number(paramVal);
  }
}



