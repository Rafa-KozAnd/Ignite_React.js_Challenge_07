import { SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { Card } from "./Card";
import { ModalViewImage } from "./Modal/ViewImage";

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards?: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  return (
    <Fragment>
      <SimpleGrid templateColumns="repeat(3, 1fr)" gap={10}>
        {cards?.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={url => {
              setSelectedImageUrl(url);
              onOpen();
            }}
          />
        ))}
      </SimpleGrid>

      {isOpen && (
        <ModalViewImage
          isOpen={isOpen}
          onClose={onClose}
          imgUrl={selectedImageUrl}
        />
      )}
    </Fragment>
  );
}
