import { Athlete } from 'cm-data'
import React, { useEffect } from 'react'

import { Button, ColumnContainer, Input, Modal, newColumn, RowContainer, Table } from 'ui-kit'
import { getCategory } from 'cm-data'

import myAxios from '../../AxiosHandler'

interface AddAthletesModalContainerProps {
    inscriptions: Athlete[],
    onAddAthletes: (athletes: Athlete[]) => void
}

export const AddAthletesModalContainer = () => {

    const [showModal, setShowModal] = React.useState(false)
    const [props, setProps] = React.useState<AddAthletesModalContainerProps>({
        inscriptions: [],
        onAddAthletes: () => { }
    })

    const openModal = (props: AddAthletesModalContainerProps) => {
        setProps(props)
        setShowModal(true)
    }

    const closeModal = () => {
        setProps({ inscriptions: [], onAddAthletes: () => { } })
        setAthletes([])
        setSearch('')
        setSearchAthletes([])
        setShowModal(false)
    }

    useEffect(() => {
        const handleOpenModal = (event: Event) => {
            const customEvent = event as CustomEvent<AddAthletesModalContainerProps>
            openModal(customEvent.detail)
        };

        const container = document.getElementById('add-athletes-modal-container')
        container?.addEventListener('open-add-athletes-modal', handleOpenModal)

        return () => {
            container?.removeEventListener('open-add-athletes-modal', handleOpenModal)
        }
    }, [])


    const [athletes, setAthletes] = React.useState<Athlete[]>([])

    const [search, setSearch] = React.useState('')
    const [searchAthletes, setSearchAthletes] = React.useState<Athlete[]>([])
    const searchAthletesFunc = async () => {
        try {
            const response = await myAxios.get('https://competitionmanager.be/api/sql/athletes?key=' + search)
            setSearchAthletes(response.data.data.map((athlete: any) => {
                return Athlete.fromJson(athlete)
            }))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log(searchAthletes)
    }, [searchAthletes])

    const columns = [
        newColumn({ title: 'Dossard', link: "bib" }),
        newColumn({ title: 'Prénom', link: "firstName" }),
        newColumn({ title: 'Nom', link: "lastName" }),
        newColumn({ title: 'Catégorie', link: "birthDate", valueGetter(row) {
            return getCategory(new Date(row.birthDate), new Date(), row.gender)
        }}),
        newColumn({ title: 'Club', link: "club" })
    ]

    return (
        <div id="add-athletes-modal-container">
            <Modal
                title="Ajouter des athlètes"
                open={showModal}
                onClose={closeModal}
            >
                <ColumnContainer>
                    {/* Search bar */}
                    <RowContainer>

                        {props.inscriptions.length > 0 &&
                            <>
                            <Button onClick={() => {
                                setSearch('')
                                setSearchAthletes(props.inscriptions)
                            }}>Les inscriptions</Button>

                            OU

                            </>
                        }

                        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button onClick={searchAthletesFunc}>Rechercher</Button>
                    </RowContainer>
                    {/* Table */}
                    <Table
                        columns={columns}
                        data={searchAthletes}
                        GridId='licence'
                        checkboxSelection
                        disableRowSelectionOnClick={false}
                        onSelect={(selected) => setAthletes(selected)}
                    />
                    {/* Add button */}
                    <Button onClick={() => {
                        props.onAddAthletes(athletes)
                        closeModal()
                    }}>Ajouter</Button>
                </ColumnContainer>
            </Modal>
        </div>
    )
}

export default AddAthletesModalContainer

function openAddAthletesModal(props: AddAthletesModalContainerProps) {
    const event = new CustomEvent('open-add-athletes-modal', { detail: props })
    document.getElementById('add-athletes-modal-container')?.dispatchEvent(event)
}

export { openAddAthletesModal }
