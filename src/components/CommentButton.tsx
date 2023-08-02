"use client"
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import Divider from "./orders/Divider";
import { jsonPost } from "@/helpers/api";
import ROUTES from "@/helpers/constants/Routes";
import Form from "./Form";
import { saveComment } from "@/actions/orders";

export type CommentButtonType =
  {orderId: number, productId: number, comment: string | null, refresh: () => Promise<any>}


export default function CommentButton({orderId, productId, comment, refresh}:
  CommentButtonType) {
    const [showModal, setShowModal] = useState(false);
    const onSubmit = () => {
      setShowModal(false);
      refresh();
    }

    return (
    <>
      <button
        className="text-2xl ml-5 text-textSecondary"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <FiEdit />
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative text-textPrimary w-auto my-6 px-5 mx-auto max-w-3xl">
              <div className="rounded-lg shadow-lg relative flex flex-col w-full bg-white border-tertiary border-4">
                <div className="border-b border-separator flex items-start justify-between p-5">
                  <h3 className="text-2xl font-semibold">
                    Comentário
                  </h3>
                </div>

                <Form action={saveComment} onSubmit={onSubmit}>
                  <div className="relative border-b border-separator  p-6 flex-auto ">
                    <input type="hidden" name="orderId" value={orderId} />
                    <input type="hidden" name="productId" value={productId} />
                    <textarea
                      name="comment"
                      className="w-full outline-none focus:outline-none h-32 bg-transparent"
                      placeholder="Comentário"
                      defaultValue={comment || ""}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-end p-6">
                    <button
                      className="mx-2 bg-warning text-textSecondary font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="mx-2 bg-tertiary text-textSecondary font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                      type="submit"
                    >
                      Guardar
                    </button>
                  </div>
                </Form>

              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
    );
  }
