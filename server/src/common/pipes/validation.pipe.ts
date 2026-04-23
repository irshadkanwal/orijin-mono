import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const getValidationPipeWithMessages = () => {
  return new ValidationPipe({
    // transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => {
        if (error.children.length > 0) {
          console.log(error);
          return error.children.map((childError) => ({
            property: error.property + '.' + childError.property,
            constraints: childError.constraints,
          }));
        }
        return {
          property: error.property,
          constraints: error.constraints,
        };
      });

      // console.log('Message', JSON.stringify(messages, null, 4));

      return new BadRequestException(messages);
    },
  });
};
