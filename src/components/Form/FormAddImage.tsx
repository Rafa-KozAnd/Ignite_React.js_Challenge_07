import { Box, Button, Stack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import { api } from "../../services/api";
import { FileInput } from "../Input/FileInput";
import { TextInput } from "../Input/TextInput";

interface FormAddImageProps {
  closeModal: () => void;
}

export interface AddImageFormData {
  image: string;
  title: string;
  description: string;
}

interface AddImageMutationVariables {
  url: string;
  title: string;
  description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState("");
  const [localImageUrl, setLocalImageUrl] = useState("");
  const toast = useToast();

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (values: AddImageMutationVariables) => {
      await api.post("/images", values);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("images");
      },
    },
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<AddImageFormData>();

  const formValidations: Record<
    keyof AddImageFormData,
    Parameters<typeof register>[1]
  > = {
    image: {
      required: "Arquivo obrigatório",
      validate: (value: any) => {
        const acceptedTypes = [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/gif",
        ];

        const file: File = value[0];

        if (!acceptedTypes.includes(file.type)) {
          return "Somente são aceitos arquivos PNG, JPEG e GIF";
        }

        // size é em bytes
        if (file.size > 1_000_000 * 10) {
          // maior que 10MB
          return "O arquivo deve ser menor que 10MB";
        }

        return true;
      },
    },
    title: {
      required: "Título obrigatório",
      minLength: {
        value: 2,
        message: "Mínimo de 2 caracteres",
      },
      maxLength: {
        value: 20,
        message: "Máximo de 20 caracteres",
      },
    },
    description: {
      required: "Descrição obrigatória",
      maxLength: {
        value: 65,
        message: "Máximo de 65 caracteres",
      },
    },
  };

  const onSubmit = async (data: AddImageFormData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: "Imagem não adicionada",
          description:
            "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
          status: "error",
        });

        return;
      }

      await mutation.mutateAsync({
        title: data.title,
        description: data.description,
        url: imageUrl,
      });

      toast({
        title: "Imagem cadastrada",
        description: "Sua imagem foi cadastrada com sucesso.",
        status: "success",
      });
    } catch {
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro ao tentar cadastrar a sua imagem.",
        status: "error",
      });
    } finally {
      reset();
      setImageUrl("");
      setLocalImageUrl("url");
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register("image", formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register("title", formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register("description", formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}