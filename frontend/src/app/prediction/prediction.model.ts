/**
 * Represents the payload required for a product category prediction request.
 *
 * This interface is used to define the structure of data that should be
 * provided when making a request to post a prediction.
 *
 * Properties:
 * @property {string} designation - A mandatory string that specifies the product designation associated with the prediction. This field is required.
 * @property {string} [description] - An optional string to provide a product description for the prediction. This field is optional.
 */
export interface PostPredictionRequestPayload {
  designation: string;
  description?: string;
}

/**
 * Represents the response received after making a prediction request.
 *
 * This interface extends the `PostPredictionRequestPayload` to include
 * additional information received in the prediction response. It contains
 * probabilities that represent the likelihood for the product to be part
 * of each possible category.
 *
 * @interface PostPredictionResponse
 * @extends PostPredictionRequestPayload
 *
 * @property {number[]} probabilities - An array of probabilities where each
 * number corresponds to the likelihood of a particular predicted category.
 * The length and order of this array depend on the number of categories
 * used while training the model.
 */
export interface PostPredictionResponse extends PostPredictionRequestPayload {
  probabilities: { categoryId: number; probability: number }[];
}
